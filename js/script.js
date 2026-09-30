// Slider interativo da section .slider

const slides = [
    { arquivo: 'WhatsApp Image 2026-09-09 at 10.32.47.jpeg', label: 'Piscinas' },
    { arquivo: 'WhatsApp Image 2026-09-09 at 10.28.46.jpeg', label: 'Cozinha' },
    { arquivo: 'WhatsApp Image 2026-09-09 at 10.28.47.jpeg', label: 'Sala de estar' },
    { arquivo: 'WhatsApp Image 2026-09-09 at 10.28.48 (1).jpeg', label: 'Quarto' },
    { arquivo: 'WhatsApp Image 2026-09-09 at 10.28.47 (2).jpeg', label: 'Banheiro' }
];

const sliderSlides = document.querySelectorAll('.slider .slide-bg');
const sliderDots = document.querySelectorAll('.slider .slider-dots .dot');
const sliderInfos = document.querySelectorAll('.slider .slide-info');
const sliderPreviews = document.querySelectorAll('.slider .preview-item');

function irParaSlide(indice){
    indice = Number(indice);

    sliderSlides.forEach(slide => slide.classList.remove('active'));
    sliderDots.forEach(dot => dot.classList.remove('active'));
    sliderInfos.forEach(info => info.classList.remove('active'));

    document.querySelector('.slider .slide-' + indice).classList.add('active');
    document.querySelector('.slider .slider-dots .dot[data-slide="' + indice + '"]').classList.add('active');
    document.querySelector('.slider .slide-info[data-slide="' + indice + '"]').classList.add('active');

    atualizarPreviews(indice);
}

function atualizarPreviews(indiceAtual){
    const total = slides.length;

    sliderPreviews.forEach((preview, posicao) => {
        const indicePreview = (indiceAtual + posicao + 1) % total;
        const slide = slides[indicePreview];

        preview.dataset.slide = indicePreview;
        preview.querySelector('img').src = encodeURI('image/Novas fotos/' + slide.arquivo);
        preview.querySelector('img').alt = slide.label;
        preview.querySelector('p').textContent = slide.label;
    });
}

sliderDots.forEach(dot => {
    dot.addEventListener('click', () => irParaSlide(dot.dataset.slide));
});

sliderPreviews.forEach(preview => {
    preview.addEventListener('click', () => irParaSlide(preview.dataset.slide));
});

atualizarPreviews(0);
