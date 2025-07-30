function changeHUE(e) {
    let hue = e.target.value;
    document.documentElement.style.setProperty('--color-hue',`${hue}deg`);
    if (document.querySelector('#pagehue') != null) {
        document.querySelector('#pagehue').value = hue;
    }
}

if (localStorage.getItem('hue') != null) {
    changeHUE({target:{value:localStorage.getItem('hue')}})
} else {
    changeHUE({target:{value:180}})
}