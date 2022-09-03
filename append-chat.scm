(let*
	(
		(image 1)
		(chatGroup (car (gimp-layer-group-new image)))
		(text 0)
		(counter 0)
	)

	; name the layer group
	(gimp-item-set-name chatGroup "chat")

	; insert layer group into the image
	(gimp-image-insert-layer image chatGroup 0 -1)

	; create text
	(set! text (car (gimp-text-fontname image -1 50 50 "Test" 0 1 35 1 "Nimbus Sans")))

	; put the text in the chat layerGroup
	(gimp-image-reorder-item image text chatGroup -1)
)


(gimp-image-reorder-item 1 (car (gimp-text-fontname 1 -1 50 50 "Test" 0 1 35 1 "Nimbus Sans")) (car (gimp-layer-group-new image)) -1)


; (map gimp-image-get-layers images)

; (gimp-text-fontname image drawable x y text border antialias size size-type fontname)
; (gimp-image-get-layer-by-name image name)
; (gimp-image-insert-layer image layer parent position)
; (gimp-image-get-layers image)


;; add a layer group
; (gimp-layer-group-new image)                          ; creates but doesnt add
; (gimp-item-set-name item name)                        ; sets the name
; (gimp-image-insert-layer image layer parent position) ; adds to image
; (gimp-image-reorder-item image item parent position)






; (gimp-item-get-name item)
; (gimp-item-set-name item name)
