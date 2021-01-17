import gallery from "../gallery-items.js";

const refs = {
    gallery: document.querySelector('.js-gallery'),
    lightboxImage: document.querySelector('.lightbox__image'),
    lightbox: document.querySelector('.lightbox'),
    closeLightboxBtn: document.querySelector('button[data-action="close-lightbox"]'),
    lightboxOverlay: document.querySelector('.lightbox__overlay'),
};

refs.gallery.append(...galleryListItem(gallery)); //Рендер разметки по массиву данных и предоставленному шаблону.

refs.gallery.addEventListener('click', onOpenLightbox); //Реализация делегирования на галерее ul.js-gallery.

refs.closeLightboxBtn.addEventListener('click', onCloseLightbox); //Закрытие модального окна по клику на кнопку.

refs.lightboxOverlay.addEventListener('click', onCloseLightbox); //Закрытие модального окна по клику на div.        lightbox__overlay.

//Функция Создание разметки по массиву данных и предоставленному шаблону.
function galleryListItem (gallery) {
    let dataIndex = 0;
    return gallery.map(item => { 
    const liItem = document.createElement('li');
    const aLink = document.createElement('a');
    const image = document.createElement('img');

    liItem.classList.add('gallery__item');
    aLink.classList.add('gallery__link');
    image.classList.add('gallery__image');

    aLink.href = item.original; 
    image.src = item.preview;
    image.setAttribute('data-source', `${item.original}`);
    image.alt = item.description;
    image.setAttribute('data-index', `${dataIndex}`);

    aLink.append(image);
    liItem.append(aLink);
    dataIndex += 1;
    return liItem;
    });
};

// Функция Открытие модального окна по клику на элементе галереи.
function onOpenLightbox (event) { 
    event.preventDefault(); // Отменяем дефолтное поведение, в нашем случае не переходим по ссилке в <a>
    const imageRef = event.target;

    if (imageRef.nodeName !== 'IMG') {
        return;
    }
    
    const largeImageURL = imageRef.dataset.source; //получение url большого изображения.
    const dataIndex = imageRef.dataset.index;//получение индекса открітого изображения.
    
    setLargeImageSrc(largeImageURL, dataIndex); //Подмена значения атрибута src и index элемента img.lightbox__image.
    
    refs.lightbox.classList.add('is-open');

    window.addEventListener('keydown', onPressEscape);
    window.addEventListener('keydown', onPressArrow);
};

// Функция перелистывания картинок стрелками клавиатуры.
function onPressArrow (event) {
    if (event.code === 'ArrowRight') {
        const nextIndex = Number(refs.lightboxImage.dataset.index) + 1;
        if (nextIndex > gallery.length - 1) {
            return;
        };

        const nextURL = gallery[nextIndex].original;
        setLargeImageSrc(nextURL, nextIndex);

    } else if (event.code === 'ArrowLeft') {
        const pastIndex = Number(refs.lightboxImage.dataset.index) - 1;
        if (pastIndex < 0) {
            return;
        };

        const pastURL = gallery[pastIndex].original;
        setLargeImageSrc(pastURL, pastIndex);
    }
};

// Функция Подмена значения атрибута src и data-index элемента img.lightbox__image.
function setLargeImageSrc(url, index) {
    refs.lightboxImage.src = url;
    refs.lightboxImage.setAttribute('data-index', `${index}`);

};

// Функция Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
function onCloseLightbox () {
    window.removeEventListener('keydown', onPressEscape);
    window.removeEventListener('keydown', onPressArrow);
    refs.lightbox.classList.remove('is-open');
    refs.lightboxImage.src = ''; //Очистка значения атрибута src элемента img.lightbox__image.
    refs.lightboxImage.dataset.index = ''; //Очистка значения атрибута data-index элемента img.lightbox__image.
};

// Функция Закрытие модального окна по нажатию клавиши ESC.
function onPressEscape (event) {
    if (event.code === 'Escape') {
        onCloseLightbox ();
    }
};

