;; (define (value p q)
;;   (let ((A B))
;;     (if X
;; 	Y
;; 	Z)))

;; (define (value x e)
;;   (cond ((foreign? x)
;; 	 (call-foreign x e))
;; 	((var? x)
;; 	 (let ((v (lookup x e)))
;;            (if v
;;                (value (cadr v) e)
;;                x)))
;; 	(else x)))


(define (append3 list1 list2 list3)
  (append2 list1 (append2 list2 list3)))

(define result_ '())
(define (clear_result) (set! result_ '()))
