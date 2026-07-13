// ==UserScript==
// @name        修复Firefox键盘跨行移动光标受阻的bug
// @description https://bugzilla.mozilla.org/show_bug.cgi?id=1761941
// @version     1.0.0
// @author      satgo1546
// @homepageURL https://satgo1546.github.io/bookmarkvar/
// @namespace   https://satgo1546.github.io/
// @icon        data:image/jxl;base64,/wpDwE4IBAgAVAMAOABYAFiaJwq4B8LQoR8BAAbgXBeeg/hDBEKfweWHxlO8awPNU2HEBhG2xXzzwO8oiZ7VAnSESFTyfocBmAHITJrgqKgYY2MjIiJiSDpQwGLY1p1IZrS3GZTnOawXolNiQtRbStWOM+i0tFPy2ZZForgTGMsGqr6J0COISHUAtuEVqlRCxX7B4/+58/+Pfk8FglBbYiYE6qU0XF4r8Bk3WRXVGks547nvzdvPv/VebWXVgSRj68rtHD4klRT+m7HGN0hpHtaHh4YqwsIIQoaDWg2ADYI=
// @match       <all_urls>
// @grant       none
// ==/UserScript==

addEventListener('keydown', e => {
	// originalTarget仅限Firefox支持，可以偷出shadow DOM（无论开闭）里的元素。
	const el = e.originalTarget ?? e.target
	if (el.tagName === 'TEXTAREA') {
		const {selectionStart, selectionEnd, selectionDirection} = el
		const head = selectionDirection === 'backward' ? selectionStart : selectionEnd
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			// 等待浏览器完成事件处理。
			// setTimeout有闪烁的问题，换requestAnimationFrame就好了，我也不知道为什么。
			requestAnimationFrame(() => {
				if (!el.isConnected || !el.matches(':focus')) return
				// 如果光标位置仍不变，则补偿一次移动。
				const newHead = head + ((e.key === 'ArrowRight') - (e.key === 'ArrowLeft'))
				if (el.selectionStart === selectionStart && el.selectionEnd === selectionEnd && el.selectionDirection === selectionDirection && newHead >= 0 && newHead <= el.value.length) {
					if (!e.shiftKey) {
						el.selectionStart = el.selectionEnd = newHead
					} else if (selectionDirection === 'backward' || selectionStart === selectionEnd) {
						el.selectionStart = newHead
					} else {
						el.selectionEnd = newHead
					}
				}
			})
		}
	}
  // for contentEditable:
  // getSelection().modify('move', 'forward', 'word')
}, {capture: true})
