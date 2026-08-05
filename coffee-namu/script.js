'use strict'

// Scroll reveal — the noscript block in <head> unhides everything without JS.
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
    if (toggle.getAttribute('aria-expanded') === 'true') {
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
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) close()
  })
})()

// Pre-order builder. Prices come straight from the cake menu; red velvet has no
// S1 size, so that option disables itself and the selection falls back to S3.
;(function builder() {
  var root = document.querySelector('.builder')
  if (!root) return

  var CAKES = {
    strawberry: { name: 'strawberry cake', S3: 139800, S1: 84800 },
    redvelvet: { name: 'red velvet cake', S3: 139800, S1: null },
    oreo: { name: 'oreo cake', S3: 129800, S1: 79800 },
    choco: { name: 'choco blue velvet cake', S3: 139800, S1: 89800 },
  }
  var SIZE_LABEL = { S1: 'S1 · 15см', S3: 'S3 · 21см' }

  var state = { cake: 'strawberry', size: 'S3', branch: 'IC Tower' }

  var chips = root.querySelectorAll('[data-cake]')
  var sizes = root.querySelectorAll('[data-size]')
  var branches = root.querySelectorAll('[data-branch]')
  var out = {
    cake: root.querySelector('[data-sum="cake"]'),
    size: root.querySelector('[data-sum="size"]'),
    branch: root.querySelector('[data-sum="branch"]'),
    total: root.querySelector('[data-sum="total"]'),
  }

  function money(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '₮'
  }

  function render() {
    var cake = CAKES[state.cake]

    // A cake without the currently selected size falls back to one it has.
    if (!cake[state.size]) state.size = cake.S3 ? 'S3' : 'S1'

    chips.forEach(function (el) {
      el.classList.toggle('is-on', el.dataset.cake === state.cake)
      el.setAttribute('aria-pressed', el.dataset.cake === state.cake ? 'true' : 'false')
    })

    sizes.forEach(function (el) {
      var key = el.dataset.size
      var price = cake[key]
      el.disabled = !price
      el.classList.toggle('is-on', !!price && key === state.size)
      el.setAttribute('aria-pressed', !!price && key === state.size ? 'true' : 'false')
      var priceEl = el.querySelector('.size-price')
      if (priceEl) priceEl.textContent = price ? money(price) : 'Байхгүй'
    })

    branches.forEach(function (el) {
      el.classList.toggle('is-on', el.dataset.branch === state.branch)
      el.setAttribute('aria-pressed', el.dataset.branch === state.branch ? 'true' : 'false')
    })

    if (out.cake) out.cake.textContent = cake.name
    if (out.size) out.size.textContent = SIZE_LABEL[state.size]
    if (out.branch) out.branch.textContent = state.branch
    if (out.total) out.total.textContent = money(cake[state.size])
  }

  chips.forEach(function (el) {
    el.addEventListener('click', function () {
      state.cake = el.dataset.cake
      render()
    })
  })
  sizes.forEach(function (el) {
    el.addEventListener('click', function () {
      if (el.disabled) return
      state.size = el.dataset.size
      render()
    })
  })
  branches.forEach(function (el) {
    el.addEventListener('click', function () {
      state.branch = el.dataset.branch
      render()
    })
  })

  // Pickup is next-day at the earliest; default two days out.
  var pickup = document.getElementById('pickup')
  if (pickup) {
    var day = 864e5
    var iso = function (t) {
      return new Date(t).toISOString().slice(0, 10)
    }
    var now = Date.now()
    pickup.min = iso(now + day)
    pickup.value = iso(now + 2 * day)
  }

  render()
})()
