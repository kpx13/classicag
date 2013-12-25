/**
 * Скрипт снегопада.
 *
 */

var snowfall = new function()
{
   // Объявление конфигурационного объекта
   var settings = {};

   // Настройки
   settings['use_images'] = true;              // Использовать ли изображения
   settings['flake_symbol'] = "*";             // Символ "снежинки"
   settings['flakes_dir_name'] = "/static/js/snow";       // Имя папки с изображениями
   settings['flake_imgs_ext'] = "gif";        // Расширения
   settings['flake_types_num'] = 5;            // Количество "видов" снежинок
   settings['flake_objects_num'] = 41;         // Количество "объектов" снежинок
   settings['flake_symbol_color'] = 'blue';    // Цвет текстовых снежинок
   settings['doctype'] = 'html';               // Ваш доктайп (если он не указан не изменяйте эту опцию).
                                               // Возможные значения: xhtml || html
   settings['update_positions_interval'] = 40; //Интервал обновления позиций снежинок (в миллисекундах)
                                               //по умолчанию -- 40
   // Константы
   var snow_consts = {};
   snow_consts["borderForce"] = 0.01; //Сила отталкивания от краёв; изменять именно эту константу
   snow_consts["g"] = 54;
   snow_consts["m"] = 0.1;
   snow_consts["k"] = 0.1;
   snow_consts["F"] = 20;
   snow_consts["dt"] = 1;
   snow_consts["mouseX"] = -1000;
   snow_consts["mouseY"] = -1000;

   // Интервал для вызова метода flakes_positions
   var positions;

   //Статус снегопада (идет; не идет)
   var status = false;

   /**
    * Кэшируем изображения если они включены.
    */
   if (settings['use_images'])
   {
      var imgs = new Array();
      for (var numimg = 1; numimg <= settings['flake_types_num']; numimg++)
      {
         imgs[numimg] = new Image();
         imgs[numimg].src = settings['flakes_dir_name'] + '/' + numimg + '.' + settings['flake_imgs_ext'];
      }
   }

   /**
    * Метод изменит настройки скрипта,
    * если переданные ему настройки валидные.
    */
   var set_settings = function(new_settings)
   {
      if (new_settings)
      {
         if (typeof new_settings['use_images'] != 'boolean' || typeof new_settings['flake_symbol'] != 'string'
             || typeof new_settings['flakes_dir_name'] != 'string' || typeof new_settings['flake_imgs_ext'] != 'string'
             || typeof new_settings['flake_types_num'] != 'number' || typeof new_settings['flake_objects_num'] != 'number'
             || typeof new_settings['flake_symbol_color'] != 'string' || typeof new_settings['doctype'] != 'string'
             || typeof new_settings['update_positions_interval'] != 'number')
         {
            return false;
         } else {
            settings = new_settings;
         }
      }

      return true;
   }

   /**
    * Метод изменит значение переменных
    * snow_consts["mouseX"] и snow_consts["mouseY"] записав в них
    * координаты мыщи.
    */
   var mouse_Coords = function(event)
   {
      var event = event || window.event;
      snow_consts["mouseX"] = event.clientX;
      snow_consts["mouseY"] = event.clientY;
   }

   document.getElementsByTagName("body")[0].onmousemove = mouse_Coords;

   /**
    * Метод создает settings['flake_objects_num'] снежинок
    * задавая им все необходимые свойства.
    */
   var create_flakes = function()
   {
      var clientWidth = document.getElementsByTagName("body")[0].clientWidth;
      var clientHeight = document.getElementsByTagName("body")[0].clientHeight;
      var body_element = document.getElementsByTagName("body")[0];
      for (var id=1; id<=settings['flake_objects_num']; id++) /* На каждой итерации цикла создается снежинка */
      {
         var flake_tag = 0;
         if (settings['use_images']) // Выбор тега снежинки в зависимсти от опции settings['use_images']
         {
            flake_tag = 'img';
         } else {
            flake_tag = 'div';
         }
         flake_obj = document.createElement(flake_tag); /* Задаются все необходимые свойства. */
         if (settings['use_images']) /* Создание объекта снежинки в зависимости от опции settings['use_images'] */
         {
            var random_num = Math.floor(Math.random() * settings['flake_types_num']) + 1;
            flake_obj.src = imgs[random_num].src;
            flake_obj.alt = "flake" + id;
         } else {
            flake_obj.appendChild(document.createTextNode(settings['flake_symbol']));
         }
         flake_obj.id = 'flake'+id;
         flake_obj.style.color = settings['flake_symbol_color'];
         var flake_obj = body_element.appendChild(flake_obj); /* Вставляем нашу снежинки в тег body */
         flake_obj.halfWidth = flake_obj.clientWidth/2;  /* Радиус снежинки */
         flake_obj.halfHeight = flake_obj.clientHeight/2;/* Высота снежинки */
         flake_obj.style.position = "absolute";
         flake_obj.left = Math.random() * (clientWidth - flake_obj.halfWidth); /* Два специальных свойства с целью работы скорости снежинок, так как style.left и top может хранить только целые значения. */
         flake_obj.top = Math.random() * (clientHeight - flake_obj.halfHeight - snow_consts["g"]);
         flake_obj.amplitude = 1 + Math.random(); /* Отклонение от оси */
         flake_obj.speed = 1 + Math.random() * 0.2; /* Скорость падения */
         flake_obj.tempo = 2*Math.PI/(80 + 80 * Math.random()); /* Скорость покачивания */
         flake_obj.speedX = 0; /* В этих свойствах ранится разгон */
         flake_obj.speedY = 0;
      }
   }

   var delete_flakes = function()
   {
      var body_element = document.getElementsByTagName("body")[0];
      for (var id=1; id<=settings['flake_objects_num']; id++)
      {
         var flake_obj = document.getElementById('flake' + id);
         body_element.removeChild(flake_obj);
      }
   }

   var flakes_positions = function()
   {
      var clientWidth = document.getElementsByTagName("body")[0].clientWidth; /* Переменные для удобства */
      var clientHeight = document.getElementsByTagName("body")[0].clientHeight;
      var scrollLeft = document.getElementsByTagName("body")[0].scrollLeft;
      if (settings['doctype'] === 'html')
      {
         var scrollTop = document.getElementsByTagName("body")[0].scrollTop;
      } else {
         var scrollTop = document.documentElement.scrollTop;
      }
      for (var i=1; i<=settings['flake_objects_num']; i++)                        /* Изменение положения снежинки на итерации цикла */
      {
         var flake_obj = document.getElementById('flake'+i); /* Получаем объект снежинки */
         flake_obj.left += (flake_obj.speedX + flake_obj.amplitude*Math.cos(flake_obj.top*flake_obj.tempo))*snow_consts["dt"];
         /* Выше! Это свойство создано с целью работы разных скоростей снежинок так как style.left может хранить только
         цельные значения. */
         flake_obj.top += (flake_obj.speedY + flake_obj.speed)*snow_consts["dt"];
         /* Выше! Это свойство создано с целью работы разных скоростей снежинок так как style.left может хранить только
         цельные значения. */
         if (flake_obj.top < - snow_consts["g"]) /* Проверка не вышла ли снежинка за край экрана */
         {
            flake_obj.top = -snow_consts["g"];
            flake_obj.speedX = flake_obj.speedY = 0; /* Обнуляем разгон! */
         } else {
            if (flake_obj.top > (clientHeight - snow_consts["g"])) /* Снежинка вышла за край изменяем положение. */
            {
               flake_obj.style.top = scrollTop;
               flake_obj.top = - snow_consts["g"];
               flake_obj.speedX = flake_obj.speedY = 0; /* Обнуляем разгон! */
               flake_obj.style.left = Math.floor(flake_obj.left = Math.random() * (clientWidth - flake_obj.halfWidth)) + scrollLeft;
            }
         }
         var deltaX = flake_obj.left + flake_obj.halfWidth - snow_consts["mouseX"];            /* Начинаем вычислять left и top координаты в зависимости от положения мыщи */
         var deltaY = flake_obj.top + flake_obj.halfHeight/2 - snow_consts["mouseY"];
         var Fx_old = snow_consts["F"] * deltaX/(deltaX*deltaX + deltaY*deltaY) - snow_consts["k"]*flake_obj.speedX;
         var Fx = Fx_old + snow_consts["borderForce"] * (Math.max(snow_consts["g"] - flake_obj.left, 0) - Math.max(flake_obj.left - clientWidth + 2*snow_consts["g"], 0));
         var Fy = snow_consts["F"] * deltaY/(deltaX*deltaX + deltaY*deltaY) - snow_consts["k"]*flake_obj.speedY;
         flake_obj.speedX += Fx/snow_consts["m"]*snow_consts["dt"];
         flake_obj.speedY += Fy/snow_consts["m"]*snow_consts["dt"];
         flake_obj.style.left = scrollLeft + Math.round(flake_obj.left) + 'px'; /* Устанавливаем координаты! */
         flake_obj.style.top = scrollTop + Math.round(flake_obj.top) + 'px';
      }
   }

   this.start = function(new_settings)
   {
      if (status)
      {
         this.stop();
      }

      //Вызовем метод сет сеттингс, если настройки переданы в качестве аргумента методу start
      //и они валидные -- то он изменит настройки скрипта.
      if (!set_settings(new_settings))
      {
         throw new Error('Настройки, переданные методу snowfall::start() не валидные!');
      }

      create_flakes(); /* Создаем снежинки */
      positions = setInterval(flakes_positions, settings['update_positions_interval']); /* Запускаем метод flakes_positions каждые 40 миллисекунд */

      status = true;
   }

   this.stop = function()
   {
      if (!status) return;

      clearInterval(positions);
      delete_flakes();

      status = false;
   }
}


snowfall.start();