/**
 * ������ ���������.
 *
 */

var snowfall = new function()
{
   // ���������� ����������������� �������
   var settings = {};

   // ���������
   settings['use_images'] = true;              // ������������ �� �����������
   settings['flake_symbol'] = "*";             // ������ "��������"
   settings['flakes_dir_name'] = "/static/js/snow";       // ��� ����� � �������������
   settings['flake_imgs_ext'] = "gif";        // ����������
   settings['flake_types_num'] = 5;            // ���������� "�����" ��������
   settings['flake_objects_num'] = 41;         // ���������� "��������" ��������
   settings['flake_symbol_color'] = 'blue';    // ���� ��������� ��������
   settings['doctype'] = 'html';               // ��� ������� (���� �� �� ������ �� ��������� ��� �����).
                                               // ��������� ��������: xhtml || html
   settings['update_positions_interval'] = 40; //�������� ���������� ������� �������� (� �������������)
                                               //�� ��������� -- 40
   // ���������
   var snow_consts = {};
   snow_consts["borderForce"] = 0.01; //���� ������������ �� ����; �������� ������ ��� ���������
   snow_consts["g"] = 54;
   snow_consts["m"] = 0.1;
   snow_consts["k"] = 0.1;
   snow_consts["F"] = 20;
   snow_consts["dt"] = 1;
   snow_consts["mouseX"] = -1000;
   snow_consts["mouseY"] = -1000;

   // �������� ��� ������ ������ flakes_positions
   var positions;

   //������ ��������� (����; �� ����)
   var status = false;

   /**
    * �������� ����������� ���� ��� ��������.
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
    * ����� ������� ��������� �������,
    * ���� ���������� ��� ��������� ��������.
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
    * ����� ������� �������� ����������
    * snow_consts["mouseX"] � snow_consts["mouseY"] ������� � ���
    * ���������� ����.
    */
   var mouse_Coords = function(event)
   {
      var event = event || window.event;
      snow_consts["mouseX"] = event.clientX;
      snow_consts["mouseY"] = event.clientY;
   }

   document.getElementsByTagName("body")[0].onmousemove = mouse_Coords;

   /**
    * ����� ������� settings['flake_objects_num'] ��������
    * ������� �� ��� ����������� ��������.
    */
   var create_flakes = function()
   {
      var clientWidth = document.getElementsByTagName("body")[0].clientWidth;
      var clientHeight = document.getElementsByTagName("body")[0].clientHeight;
      var body_element = document.getElementsByTagName("body")[0];
      for (var id=1; id<=settings['flake_objects_num']; id++) /* �� ������ �������� ����� ��������� �������� */
      {
         var flake_tag = 0;
         if (settings['use_images']) // ����� ���� �������� � ���������� �� ����� settings['use_images']
         {
            flake_tag = 'img';
         } else {
            flake_tag = 'div';
         }
         flake_obj = document.createElement(flake_tag); /* �������� ��� ����������� ��������. */
         if (settings['use_images']) /* �������� ������� �������� � ����������� �� ����� settings['use_images'] */
         {
            var random_num = Math.floor(Math.random() * settings['flake_types_num']) + 1;
            flake_obj.src = imgs[random_num].src;
            flake_obj.alt = "flake" + id;
         } else {
            flake_obj.appendChild(document.createTextNode(settings['flake_symbol']));
         }
         flake_obj.id = 'flake'+id;
         flake_obj.style.color = settings['flake_symbol_color'];
         var flake_obj = body_element.appendChild(flake_obj); /* ��������� ���� �������� � ��� body */
         flake_obj.halfWidth = flake_obj.clientWidth/2;  /* ������ �������� */
         flake_obj.halfHeight = flake_obj.clientHeight/2;/* ������ �������� */
         flake_obj.style.position = "absolute";
         flake_obj.left = Math.random() * (clientWidth - flake_obj.halfWidth); /* ��� ����������� �������� � ����� ������ �������� ��������, ��� ��� style.left � top ����� ������� ������ ����� ��������. */
         flake_obj.top = Math.random() * (clientHeight - flake_obj.halfHeight - snow_consts["g"]);
         flake_obj.amplitude = 1 + Math.random(); /* ���������� �� ��� */
         flake_obj.speed = 1 + Math.random() * 0.2; /* �������� ������� */
         flake_obj.tempo = 2*Math.PI/(80 + 80 * Math.random()); /* �������� ����������� */
         flake_obj.speedX = 0; /* � ���� ��������� ������� ������ */
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
      var clientWidth = document.getElementsByTagName("body")[0].clientWidth; /* ���������� ��� �������� */
      var clientHeight = document.getElementsByTagName("body")[0].clientHeight;
      var scrollLeft = document.getElementsByTagName("body")[0].scrollLeft;
      if (settings['doctype'] === 'html')
      {
         var scrollTop = document.getElementsByTagName("body")[0].scrollTop;
      } else {
         var scrollTop = document.documentElement.scrollTop;
      }
      for (var i=1; i<=settings['flake_objects_num']; i++)                        /* ��������� ��������� �������� �� �������� ����� */
      {
         var flake_obj = document.getElementById('flake'+i); /* �������� ������ �������� */
         flake_obj.left += (flake_obj.speedX + flake_obj.amplitude*Math.cos(flake_obj.top*flake_obj.tempo))*snow_consts["dt"];
         /* ����! ��� �������� ������� � ����� ������ ������ ��������� �������� ��� ��� style.left ����� ������� ������
         ������� ��������. */
         flake_obj.top += (flake_obj.speedY + flake_obj.speed)*snow_consts["dt"];
         /* ����! ��� �������� ������� � ����� ������ ������ ��������� �������� ��� ��� style.left ����� ������� ������
         ������� ��������. */
         if (flake_obj.top < - snow_consts["g"]) /* �������� �� ����� �� �������� �� ���� ������ */
         {
            flake_obj.top = -snow_consts["g"];
            flake_obj.speedX = flake_obj.speedY = 0; /* �������� ������! */
         } else {
            if (flake_obj.top > (clientHeight - snow_consts["g"])) /* �������� ����� �� ���� �������� ���������. */
            {
               flake_obj.style.top = scrollTop;
               flake_obj.top = - snow_consts["g"];
               flake_obj.speedX = flake_obj.speedY = 0; /* �������� ������! */
               flake_obj.style.left = Math.floor(flake_obj.left = Math.random() * (clientWidth - flake_obj.halfWidth)) + scrollLeft;
            }
         }
         var deltaX = flake_obj.left + flake_obj.halfWidth - snow_consts["mouseX"];            /* �������� ��������� left � top ���������� � ����������� �� ��������� ���� */
         var deltaY = flake_obj.top + flake_obj.halfHeight/2 - snow_consts["mouseY"];
         var Fx_old = snow_consts["F"] * deltaX/(deltaX*deltaX + deltaY*deltaY) - snow_consts["k"]*flake_obj.speedX;
         var Fx = Fx_old + snow_consts["borderForce"] * (Math.max(snow_consts["g"] - flake_obj.left, 0) - Math.max(flake_obj.left - clientWidth + 2*snow_consts["g"], 0));
         var Fy = snow_consts["F"] * deltaY/(deltaX*deltaX + deltaY*deltaY) - snow_consts["k"]*flake_obj.speedY;
         flake_obj.speedX += Fx/snow_consts["m"]*snow_consts["dt"];
         flake_obj.speedY += Fy/snow_consts["m"]*snow_consts["dt"];
         flake_obj.style.left = scrollLeft + Math.round(flake_obj.left) + 'px'; /* ������������� ����������! */
         flake_obj.style.top = scrollTop + Math.round(flake_obj.top) + 'px';
      }
   }

   this.start = function(new_settings)
   {
      if (status)
      {
         this.stop();
      }

      //������� ����� ��� ��������, ���� ��������� �������� � �������� ��������� ������ start
      //� ��� �������� -- �� �� ������� ��������� �������.
      if (!set_settings(new_settings))
      {
         throw new Error('���������, ���������� ������ snowfall::start() �� ��������!');
      }

      create_flakes(); /* ������� �������� */
      positions = setInterval(flakes_positions, settings['update_positions_interval']); /* ��������� ����� flakes_positions ������ 40 ����������� */

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