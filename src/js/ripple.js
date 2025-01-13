function createRipple(event) {
    const element = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
    circle.classList.add('ripple-effect');

    const ripple = element.querySelector('.ripple-effect');
    if (ripple) {
        ripple.remove();
    }

    element.appendChild(circle);
}

// Add ripple effect to all elements with ripple class
const rippleElements = document.querySelectorAll('.ripple');
rippleElements.forEach(element => {
    element.addEventListener('click', createRipple);
});

// Add hover glow effect to visualizer container
const visualizer = document.querySelector('#visualizer');
visualizer.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const glow = `radial-gradient(circle at ${x}px ${y}px, 
        rgba(255,255,255,0.1) 0%, 
        rgba(255,255,255,0) 50%)`;
    
    visualizer.style.background = glow;
});
