class Slider{
    constructor({
        slider = '.slider',
        sliderLines = '.slider__lines',
        sliderItem = '.slider__item',
        duration = 400,
        direction = 'x',
        active = 0,
        slidesToMove = 1,
        slidesToShow = 1,
        margin = 0,
        buttons = false,
        pagination = false,
        breakpoints
    })
    {
        this.slider = slider instanceof HTMLElement ? slider : document.querySelector(slider);
        this.sliderLines = sliderLines instanceof HTMLElement ? sliderLines : this.slider.querySelector(sliderLines);
        this.sliderItems = sliderItem instanceof HTMLElement ? sliderItem : this.slider.querySelectorAll(sliderItem);
        this.duration = duration >= 200 && duration <= 2000 ? duration : 400;
        this.direction = direction.toUpperCase();
        this.active = active < 0 || active > this.sliderItems.length - 1 ? 0 : active;
        this.slidesToMove = slidesToMove >= this.sliderItems.length || slidesToMove <= 0 ? 1 : slidesToMove;
        this.slidesToShow = slidesToShow > 0 ? slidesToShow : 1;
        this.margin = margin >= 0 && margin <= 60 ? margin : 0;
        this.sliderTrueSize = this.slider.querySelector('.slider__true-size');
        this.buttons = buttons;
        this.pagination = pagination;
        this.breakpoints = breakpoints;
        if(this.buttons){
            this.prev = this.slider.querySelector('.slider__prev');
            this.next = this.slider.querySelector('.slider__next');   
            this.disableButtons();
            this.prev.addEventListener('click', () => this.moveLeft());
            this.next.addEventListener('click', () => this.moveRight());
        }
        if(this.pagination){
            this.navigation = this.slider.querySelector('.slider__pagination');
            this.navigation.innerHTML = '';
            for (let i = 0; i < this.sliderItems.length; i++) {
                let li = '<li></li>';
                this.navigation.innerHTML += li;
            }
            this.bullets = [...this.navigation.children];
            this.bullets.forEach(item => {
                item.addEventListener('click', (e) => this.clickBullets(e));
            })
        }
        this.copySlider = {};
        for (const key in this) {
            this.copySlider[key] = this[key];
        }
        this.posX1 = 0;
        this.posX2 = 0;
        this.posInit = 0;
        this.basicStyles();
        this.setClass();
        window.addEventListener('resize', () => this.basicStyles());
        this.slider.addEventListener('mousedown', this.touchStart);
        this.slider.addEventListener('touchstart', this.touchStart);
        
    }
    basicStyles(){
        this.slider.style.overflow = 'hidden';
        this.sliderLines.style.overflow = 'hidden';
        this.sliderTrueSize.style.overflow = 'hidden';
        this.sliderLines.style.display = 'flex';
        if(this.breakpoints) {
            const sorting = (a, b) => a - b;
            const keys = Object.keys(this.breakpoints).sort(sorting).reverse();
            keys.push(0);
            for (let i = 0; i < keys.length; i++) {
                if(window.innerWidth <= keys[i] && window.innerWidth > keys[i+1]) {
                    for (const id in this.breakpoints[keys[i]]) {
                        this[id] = this.breakpoints[keys[i]][id];
                    }
                }
                else if(window.innerWidth > keys[0]) {
                    for (const id in this.breakpoints[keys[i]]) {
                        this[id] = this.copySlider[id];
                    }
                } 
            }
        }
        //clientWidth, offsetWidth, scrollWidth
        //client - без учетка ползунка прокрутки
        //offset - с учетом ползунка прокрутки
        //scroll - реальный размер со всем прокручиваемым контентом
        this.sliderItems.forEach(item => {
            if(this.direction == 'Y'){
                item.style.paddingBottom = this.margin + 'px';
                item.style.width = this.sliderTrueSize.offsetWidth + 'px';
            }
            else {
                item.style.paddingRight = this.margin + 'px';
                item.style.width = this.sliderTrueSize.offsetWidth / this.slidesToShow + 'px';
            }
        });
        if(this.direction == 'Y'){
            this.sliderLines.style.flexDirection = 'column';
            this.sliderTrueSize.style.height = this.sliderItems[this.active].offsetHeight * this.slidesToShow + 'px';
            this.sliderLines.style.height = this.sliderLines.scrollHeight + 'px';
        }
        else {
            this.sliderLines.style.width = this.sliderLines.scrollWidth + 'px';
        }
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
       
    }
    slidesToMoving(){
        let w = this.sliderItems[this.active].offsetWidth;//1000
        let h = this.sliderItems[this.active].offsetHeight;//1000
        return (this.direction == 'Y') ? h * this.active : w * this.active;
    }
    setClass(){
        this.sliderItems.forEach((item, i) => {
            item.classList.remove('prev', 'active', 'next');
            if(this.pagination) this.bullets[i].classList.remove('active');
        });
        if(this.pagination) this.bullets[this.active].classList.add('active');
        this.sliderItems[this.active].classList.add('active');
        if(this.sliderItems[this.active].previousElementSibling){
            this.sliderItems[this.active].previousElementSibling.classList.add('prev');
        }
        if(this.sliderItems[this.active].nextElementSibling){
            this.sliderItems[this.active].nextElementSibling.classList.add('next');
        }
    }
    disableButtons(){
        if(this.active <= 0) this.prev.disabled = true;
        else this.prev.disabled = false;
        if(this.active >= this.sliderItems.length - 1) this.next.disabled = true;
        else this.next.disabled = false;
    }
    moveLeft(){
        if(this.active - this.slidesToMove >= 0) this.active -= this.slidesToMove;
        else this.active--;
        if(this.active < 0) this.active = 0;
        this.setClass();
        if(this.buttons) this.disableButtons();
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
    }
    moveRight(){
        if(this.active + this.slidesToMove < this.sliderItems.length+1) this.active += this.slidesToMove;
        else this.active++;
        if(this.active > this.sliderItems.length -1) this.active = this.sliderItems.length -1;
        this.setClass();
        if(this.buttons) this.disableButtons();
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
    }
    clickBullets(e){
        const idx = this.bullets.indexOf(e.target);
        this.active = idx;
        this.setClass();
        if(this.buttons) this.disableButtons();
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
    }
    touchStart = (e) => {
        // console.log(e.touches[0].clientX);
        // console.log(e.clientX);
        if(e.type == 'touchstart') this.posX1 = this.direction == 'X' ? e.touches[0].clientX : e.touches[0].clientY;
        else this.posX1 = this.direction == 'X' ? e.clientX : e.clientY;
        document.addEventListener('mousemove', this.touchMove);
        document.addEventListener('touchmove', this.touchMove);
        document.addEventListener('mouseup', this.touchEnd);
        document.addEventListener('touchend', this.touchEnd);
    }
    touchMove = (e) => {
        if(e.type == 'touchmove') this.posX2 = this.direction == 'X' ? e.changedTouches[0].clientX : e.changedTouches[0].clientY;
        else this.posX2 = this.direction == 'X' ? e.clientX : e.clientY;
        this.posInit = this.posX2 - this.posX1;
        this.sliderLines.style.transition = '0ms';
        this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving() + this.posInit}px)`;
    }
    touchEnd = () => {
        this.sliderLines.style.transition = `${this.duration}ms`;
        let end = this.direction == 'Y' ? this.slider.clientHeight/100*25 : this.slider.clientWidth/100*25;
        if(this.posInit > end) this.moveLeft();
        else if(this.posInit < -end) this.moveRight();
        else this.sliderLines.style.transform = `translate${this.direction}(${-this.slidesToMoving()}px)`;
        this.posX1 = 0;
        this.posX2 = 0;
        this.posInit = 0;
        document.removeEventListener('mousemove', this.touchMove);
        document.removeEventListener('touchmove', this.touchMove);
        document.removeEventListener('mouseup', this.touchEnd);
        document.removeEventListener('touchend', this.touchEnd);
    }
}


const mySlider = new Slider({
    slider: '.slider',
    sliderLines: '.slider__lines',
    sliderItem: '.slider__item',
    margin:30,
    active: 0,
    duration: 500,
    direction: 'x',
    slidesToMove: 1,
    slidesToShow: 3,
    buttons: true,
    pagination: true,
    breakpoints: {
        900: {
            slidesToShow: 2,
            margin: 15
        },
        450: {
            slidesToShow: 1,
            margin: 0
        }
    }
});

