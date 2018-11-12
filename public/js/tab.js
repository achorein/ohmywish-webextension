var image = document.querySelector('meta[property=\'og:image\']');
var url = document.querySelector('meta[property=\'og:url\']');
var title = document.querySelector('meta[property=\'og:title\']');
var description = document.querySelector('meta[property=\'og:description\']');
if (image) {
    image = image.getAttribute('content');
} else {
    // cas spécifique pour amazon
    image = document.querySelector('img[data-old-hires]');
    if (image) {
        image = image.getAttribute('data-old-hires');
    }
}
if (url) {
    url = url.getAttribute('content');
}
if (title) {
    title = title.getAttribute('content');
}
if (description) {
    description = description.getAttribute('content');
}

({
    image: image || '',
    url: url || '',
    title: title || '',
    description: description || ''
});