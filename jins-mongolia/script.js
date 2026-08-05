'use strict'

// Scroll reveal — elements start faded and lift in once they enter the viewport.
// The noscript block in <head> unhides everything when JS is unavailable.
;(function reveal() {
  var items = document.querySelectorAll('[data-reveal]')
  if (!items.length) return

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) {
      el.classList.add('is-in')
    })
    return
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        io.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  items.forEach(function (el) {
    io.observe(el)
  })
})()

// Mobile navigation.
;(function nav() {
  var toggle = document.querySelector('.menu-toggle')
  var panel = document.getElementById('mobile-nav')
  if (!toggle || !panel) return

  function close() {
    panel.hidden = true
    toggle.setAttribute('aria-expanded', 'false')
  }

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true'
    if (open) {
      close()
    } else {
      panel.hidden = false
      toggle.setAttribute('aria-expanded', 'true')
    }
  })

  panel.addEventListener('click', function (e) {
    if (e.target.closest('a')) close()
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close()
  })

  // A resize past the breakpoint leaves the panel stranded open otherwise.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) close()
  })
})()

// Newsletter field — this demo has no backend, so acknowledge in place.
;(function subscribe() {
  var form = document.querySelector('.subscribe')
  var msg = document.querySelector('.subscribe-msg')
  if (!form || !msg) return

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    var field = form.querySelector('input')
    if (!field || !field.value.trim()) return
    form.hidden = true
    msg.hidden = false
  })
})()
