var a='';js=10;
try{a+=';r='+escape(document.referrer);}catch(e){}try{a+=';j='+navigator.javaEnabled();js=11;}catch(e){}
try{s=screen;a+=';s='+s.width+'*'+s.height;a+=';d='+(s.colorDepth?s.colorDepth:s.pixelDepth);js=12;}catch(e){}
try{if(typeof((new Array).push('t'))==="number")js=13;}catch(e){}
try{document.write('<a href="http://top.mail.ru/jump?from=2149966">'+
'<img src="http://de.cc.b0.a2.top.mail.ru/counter?id=2149966;t=210;js='+js+a+';rand='+Math.random()+
'" alt="Рейтинг@Mail.ru" style="border:0;" height="31" width="88" \/><\/a>');}catch(e){}//]]>