;; Quantum foam: pairs of virtual particles that appear at random, drift
;; apart and annihilate. This module only keeps the pairs and their
;; randomness; the page draws them (Background.tsx).
;;
;; Randomness is xoshiro128** (Blackman and Vigna), seeded from the
;; browser's crypto.getRandomValues, so every visit fizzes differently.
;;
;; Memory: from byte 0, one vec4 of f32 per pair for the GPU: x, y in
;; [0, 1), age in [0, 1), angle in radians. From byte 4096, two f32 per
;; pair kept here: when it was born and how long it lives, in seconds.
;; Built with `wat2wasm foam.wat -o ../../../public/quantum/foam.wasm`.
(module
  (memory (export "memory") 1)
  (global $s0 (mut i32) (i32.const 1))
  (global $s1 (mut i32) (i32.const 2))
  (global $s2 (mut i32) (i32.const 3))
  (global $s3 (mut i32) (i32.const 4))

  (func (export "seed") (param $a i32) (param $b i32) (param $c i32) (param $d i32)
    (global.set $s0 (local.get $a))
    (global.set $s1 (local.get $b))
    (global.set $s2 (local.get $c))
    (global.set $s3 (local.get $d))
    ;; The generator must not start from all zeros.
    (if (i32.eqz (i32.or (i32.or (local.get $a) (local.get $b)) (i32.or (local.get $c) (local.get $d))))
      (then (global.set $s0 (i32.const 0x9e3779b9)))))

  ;; xoshiro128**: the next 32 random bits.
  (func $next (result i32)
    (local $result i32)
    (local $t i32)
    (local.set $result
      (i32.mul (i32.rotl (i32.mul (global.get $s1) (i32.const 5)) (i32.const 7)) (i32.const 9)))
    (local.set $t (i32.shl (global.get $s1) (i32.const 9)))
    (global.set $s2 (i32.xor (global.get $s2) (global.get $s0)))
    (global.set $s3 (i32.xor (global.get $s3) (global.get $s1)))
    (global.set $s1 (i32.xor (global.get $s1) (global.get $s2)))
    (global.set $s0 (i32.xor (global.get $s0) (global.get $s3)))
    (global.set $s2 (i32.xor (global.get $s2) (local.get $t)))
    (global.set $s3 (i32.rotl (global.get $s3) (i32.const 11)))
    (local.get $result))

  ;; A float in [0, 1) from the top 24 bits.
  (func $rand (result f32)
    (f32.mul
      (f32.convert_i32_u (i32.shr_u (call $next) (i32.const 8)))
      (f32.const 5.9604645e-8)))

  (func (export "rand") (result f32) (call $rand))

  ;; Moves every pair to time $now (seconds): a pair whose life is over
  ;; annihilates and a new one appears somewhere else.
  (func (export "step") (param $now f32) (param $count i32)
    (local $i i32)
    (local $out i32)
    (local $own i32)
    (local $born f32)
    (local $life f32)
    (block $done
      (loop $each
        (br_if $done (i32.ge_u (local.get $i) (local.get $count)))
        (local.set $out (i32.shl (local.get $i) (i32.const 4)))
        (local.set $own (i32.add (i32.const 4096) (i32.shl (local.get $i) (i32.const 3))))
        (local.set $born (f32.load (local.get $own)))
        (local.set $life (f32.load offset=4 (local.get $own)))
        (if (i32.or
              (f32.eq (local.get $life) (f32.const 0))
              (f32.ge (f32.sub (local.get $now) (local.get $born)) (local.get $life)))
          (then
            ;; A new pair: anywhere, at any angle, for 0.6 to 2.4 seconds.
            (local.set $life (f32.add (f32.const 0.6) (f32.mul (call $rand) (f32.const 1.8))))
            ;; The first ones start part-way through their lives, so they
            ;; don't all appear at once.
            (local.set $born
              (if (result f32) (f32.eq (f32.load offset=4 (local.get $own)) (f32.const 0))
                (then (f32.sub (local.get $now) (f32.mul (call $rand) (local.get $life))))
                (else (local.get $now))))
            (f32.store (local.get $own) (local.get $born))
            (f32.store offset=4 (local.get $own) (local.get $life))
            (f32.store (local.get $out) (call $rand))
            (f32.store offset=4 (local.get $out) (call $rand))
            (f32.store offset=12 (local.get $out) (f32.mul (call $rand) (f32.const 6.2831853)))))
        (f32.store offset=8 (local.get $out)
          (f32.div (f32.sub (local.get $now) (local.get $born)) (local.get $life)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $each)))))
