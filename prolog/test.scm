(define (value p q)
  (let ((A B))
    (if X
	(if P
	    Q
	    R)
	Z)))

;; (define (value x e)
;;   (cond ((foreign? x)
;; 	 (call-foreign x e))
;; 	((var? x)
;; 	 (let ((v (lookup x e)))
;;            (if v
;;                (value (cadr v) e)
;;                x)))
;; 	(else x)))


;; (define (append3 list1 list2 list3)
;;   (append2 list1 (append2 list2 list3)))

;; (define result_ '())
;; (define (clear_result) (set! result_ '()))

;; (define (foreign? expr)
;;   (and (pair? expr)
;;        (string? (car expr))
;;        (string=? "@" (car expr))))

;; (define (call-foreign expr bindings)
;;   (let ((func (cadr expr))
;; 	(args (cddr expr)))

;;     (cond ((string=? "unity" func)
;; 	   (car args))

;; 	  ((string=? "add" func)
;; 	   (let ((resolved-args (resolveArgs args bindings)))
;; 	     (+ (car resolved-args) (cadr resolved-args))))

;; 	  ((string=? "display" func)
;; 	   (let ((a (value (car args) bindings)))
;; 	     (display a)))
	  
;; 	  ((string=? "newline" func)
;; 	   (newline))
	  
;; 	  (else (error "call-foreign called with unknown operator" func)))))


;; ; 9-slide PROVE
;; (clear_result)
;; (newline)  
;; (newline)  
;; (prove6 '() goals db empty 1 '() db)
;; (display_result)
;; (newline)  
 (newline)

