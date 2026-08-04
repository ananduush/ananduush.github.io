// Reveal-on-scroll + gentle parallax for the Kumo Kumo landing page.
// Content is visible by default; JS only adds the entrance animation, one-way —
// once revealed an element never hides again. Reduced-motion visitors get a
// static page (decorative loops are paused in styles.css).
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) return

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'none'
          io.unobserve(e.target)
        }
      })
    },
    { threshold: 0.08 }
  )

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      el.style.opacity = '1'
      el.style.transform = 'none'
    } else {
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      io.observe(el)
    }
  })

  var pars = document.querySelectorAll('[data-par]')
  function parallax() {
    var y = window.scrollY || 0
    pars.forEach(function (el) {
      if (el.dataset.parBase === undefined) el.dataset.parBase = el.style.transform || ''
      var k = parseFloat(el.getAttribute('data-par')) || 0
      el.style.transform =
        el.dataset.parBase + ' translate3d(0,' + (-y * k).toFixed(1) + 'px,0)'
    })
  }
  parallax()
  window.addEventListener('scroll', parallax, { passive: true })
})()
