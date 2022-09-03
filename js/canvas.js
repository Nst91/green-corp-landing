const COLORS = ["255,108,80", "5,117,18", "29,39,57", "67,189,81"];
const BUBBLE_DENSITY = 100;

function generateDecimalBetween(left, right) {
   return (Math.random() * (left - right) + right).toFixed(2);
}

class Bubble {
   constructor(canvas) {
       this.canvas = canvas;

       this.getCanvasSize();

       this.init();
   }

  // Теперь реализуем метод getCanvasSize.
  //Он должен выставить свойства canvasWidth и canvasHeight, которые нужны нам для расчета положения точки на холсте.
  //Высоту и ширину html-элемента получим с помощью свойства clientWidth и clientHeight:

   getCanvasSize() {
       this.canvasWidth = this.canvas.clientWidth;
       this.canvasHeight = this.canvas.clientHeight;
   }

  // с помощью хелпера generateDecimalBetween можно проинициализировать свойства

   init() {
       this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
       this.alpha = generateDecimalBetween(5, 10) / 10;
       this.size = generateDecimalBetween(1, 3);
       this.translateX = generateDecimalBetween(0, this.canvasWidth);
       this.translateY = generateDecimalBetween(0, this.canvasHeight);

         //Теперь нужно проинициализировать свойства направления и скорости движения пузырька.
         // У каждого пузырька будет своя скорость движения, чтобы они выглядели более реалистично

       this.velocity = generateDecimalBetween(20, 40);

           //Теперь инициализируем дельту перемещения точки по оси x и по оси y.
    // На это число мы будем все время смещать позицию пузырька, таким образом, эти свойства задают скорость и направление движения
    // Как видно, движение по горизонтали (movementX) может быть от -2 до 2 — пузырьки будут идти не строго вверх, а с небольшим смещением.

       this.movementX = generateDecimalBetween(-2, 2) / this.velocity;
       this.movementY = generateDecimalBetween(1, 20) / this.velocity;
   }

     // В нем нужно обновлять x- и y-координаты нашего пузырька на значения movementX и movementY.
  // X- и y-координаты хранятся в свойствах translateX и translateY

   move() {
       this.translateX = this.translateX - this.movementX;
       this.translateY = this.translateY - this.movementY;
    //нужно еще кое-что в нем исправить. Сейчас мы будем постоянно уменьшать x- и y-координаты и в какой-то момент можем выйти за
    // границы размеров холста. Нужно обработать эту ситуацию и вернуть их обратно на холст
    // мы проверяем, что значения опустились ниже 0 в координатах или вышли за горизонтальные границы, и, если это так, заново инициализируем данные

       if (this.translateY < 0 || this.translateX < 0 || this.translateX > this.canvasWidth) {
           this.init();
           this.translateY = this.canvasHeight;
       }
   }
}

  // у нас есть конструктор и метод start. Конструктор принимает на вход id, это будет id-атрибут тега холста, по которому мы будем получать этот элемент. 
  // Метод start запустит анимацию: подстроит размеры холста, создаст пузырьки и анимирует их.

class CanvasBackground {
   constructor(id) {
       this.canvas = document.getElementById(id);
       this.ctx = this.canvas.getContext("2d");
       this.dpr = window.devicePixelRatio;
   }
  // Реализуем теперь метод start. Сначала нужно выставить ширину и высоту холста и настроить масштаб, это мы сделаем в методе canvasSize. 
  // Далее надо сгенерировать пузырьки, это мы сделаем в методе generateBubbles. 
  // И последнее — запустить анимацию, для этого вызовем метод animate

   start() {
       this.canvasSize();
       this.generateBubbles();
       this.animate();
   }
  //Ширина должна быть равна ширине холста (this.canvas.offsetWidth), умноженной на devicePixelRatio (this.dpr).
  // Высота должна быть равна высоте холста (this.canvas.offsetHeight), умноженной на devicePixelRatio (this.dpr).
  // Обратите внимание: ширину и высоту для холста мы выставили, умножив ее на значение devicePixelRatio. Это важно, чтобы потом графика на холсте
  // не отображалась мутно на мониторах с более высоким разрешением — как, например, на retina-дисплеях от Apple
  // Для контекста (this.ctx) выставите масштаб, равный devicePixelRatio (this.dpr) и для оси x, и для оси y (используйте метод ctx.scale(..., ...)).

   canvasSize() {
       this.canvas.width = this.canvas.offsetWidth * this.dpr;
       this.canvas.height = this.canvas.offsetHeight * this.dpr;

       this.ctx.scale(this.dpr, this.dpr);
   }
  // С помощью метода контекста clearRect очистите весь холст. Метод clearRect принимает на вход координаты левого верхнего угла прямоугольника (0,0) и ширину и высоту прямоугольника. 
  // В нашем случае эти величины должны равняться ширине и высоте холста (clientWidth и clientHeight).
  // Вычислим новую позицию пузырька. Для каждого элемента класса Bubble массива this.bubblesList (можно использовать метод forEach массива) нужно вызвать метод move (bubble.move()).
  // После вызова метода move с помощью метода ctx.translate нужно изменить позицию пузырька на значение (bubble.translateX, bubble.translateY).
  // После метода translate нужно начать отрисовку нового пути пузырька. Для этого вызовите метод beginPath контекста
  // С помощью метода arc контекста (this.ctx) нарисуйте круг с центром 0,0 и радиусом bubble.size
  // закрасьте круг нужным цветом. Для этого настройте у контекста (this.ctx) свойство fillStyle. Оно должно быть равно строке, которая содержит цвет в формате RGBA, например: "rgba(0,0,0,1)". 
  // Цвет должен быть равен цвету пузырька (bubble.color), alpha-значение также должно быть равно свойству alpha у пузырька (bubble.alpha).
  // Обратите внимание: bubble.color хранится в формате трех цифр через запятую (например, "255,108,80"), а fillStyle должен быть равен строке в другом формате: "rgba(0,0,0,1)".
  // Закрасьте пузырек, вызвав метод fill у контекста
  // Чтобы размер пузырька отрисовался согласно размерам холста, учитывающим devicePixelRatio, нужно также учесть его и при отрисовке пузырьков. 
  // Для этого вызовите метод this.ctx.setTransform, с помощью которого можно настроить масштабирование. 
  // Укажите горизонтальное и вертикальное масштабирование, равное this.dpr, остальные параметры укажите равными 0.

   animate() {
       this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

       this.bubblesList.forEach((bubble) => {
           bubble.move();
           this.ctx.translate(bubble.translateX, bubble.translateY);
           this.ctx.beginPath();
           this.ctx.arc(0, 0, bubble.size, 0, 2 * Math.PI);
           this.ctx.fillStyle = "rgba(" + bubble.color + "," + bubble.alpha + ")";
           this.ctx.fill();
           this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
       });
    // Вызовите метод requestAnimationFrame. 
    // На вход нужно передать функцию animate с контекстом, привязанным к текущему классу (this.animate.bind(this)).

       requestAnimationFrame(this.animate.bind(this));
   }
  // В методе generateBubbles проинициализируйте свойство bubblesList пустым массивом. 
  // В массив bubblesList добавьте экземпляры класса Bubble (new Bubble(...)) в количестве, равном BUBBLE_DENSITY. 
  // Аргументом конструктора экземпляры класса должны принимать элемент холста (this.canvas).

   generateBubbles() {
       this.bubblesList = [];
       for (let i = 0; i < BUBBLE_DENSITY; i++) {
           this.bubblesList.push(new Bubble(this.canvas))
       }
   }
}
// В конце программы создайте экземпляр класса CanvasBackground, указав ему правильный id в качестве аргумента конструктора. 
// Вызовите метод start у экземпляра класса.

const canvas = new CanvasBackground("orb-canvas");
canvas.start();