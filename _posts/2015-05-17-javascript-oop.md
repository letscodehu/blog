---
id: 502
title: 'Javascript O(O)P'
date: '2015-05-17T21:45:10+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=502'
permalink: /2015/05/17/javascript-oop/
dsq_thread_id:
    - '3783611973'
    - '3783611973'
tie_post_bg:
    - ''
    - ''
tie_post_color:
    - ''
    - ''
tie_gallery_style:
    - slider
    - slider
tie_link_url:
    - ''
    - ''
tie_link_desc:
    - ''
    - ''
tie_video_url:
    - ''
    - ''
tie_embed_code:
    - ''
    - ''
tie_audio_mp3:
    - ''
    - ''
tie_audio_m4a:
    - ''
    - ''
tie_audio_oga:
    - ''
    - ''
tie_audio_soundcloud:
    - ''
    - ''
tie_quote_author:
    - ''
    - ''
tie_quote_link:
    - ''
    - ''
tie_quote_text:
    - ''
    - ''
tie_status_facebook:
    - ''
    - ''
tie_status_twitter:
    - ''
    - ''
categories:
    - JavaScript
tags:
    - inheritance
    - javascript
    - modell
    - namespaces
    - object
    - oop
    - prototype
---

A webfejlesztésnek, akár akarjuk, akár nem, bizony szerves részét képezi a frontend, így az életutunkbizony keresztezni fogja némi javascript, kivéve, ha dedikáltan backendesek vagyunk.![dHCqj](assets/uploads/2015/05/dHCqj.jpg)

Viszont amit a javascript terén teszünk, az az esetek túlnyomó többségében nem nevezhető fejlesztésnek, inkább csak különböző library-ket rántunk be, esetleg jquery selectorokat hívogatunk meg és próbaljuk minimálisra csökkenteni azt az időt, amíg az IDE-ben JS kód van megnyitva.  
Ha a kódunk tényleg csak a globális névtérbe dobált változók tömkelege, akkor sajnos a helyzet nem is fog változni, főleg akkor ha Php-ben megszoktuk a jól struktúrált/névterekre bontott kódot.

**Pedig a javascript is tud ám ilyet! (a maga módján)**

Tegyük fel, hogy nem szeretnénk a globális névteret teleszemetelni, így névtereket akarunk definiálni:  
Mi sem egyszerűbb? Javascriptben az egész annyi, hogy létrehozzuk a hozzá tartozó objektumot:

```
<pre data-language="javascript">var MyNamespace = {};
```

Bumm, kész is van a névterünk! Viszont ezzel túl sokra nem megyünk, nem árt ha létrehozunk az adott névtéren belül valami osztályt (ami elég morbid lesz, mivel a javascript-ben nincs class keyword, hanem az osztályokat, mint function-öket fogjuk definiálni )

```
<pre data-language="javascript">MyNamespace.Translate = function(locale){
    this.locale = locale; // ezt felfoghatjuk az osztályunk konstruktorának
}
```

A fenti osztály viszont példányosítás nélkül mit sem ér, tehát akkor hozzuk létre:

```
<pre data-language="javascript">var trans = new MyNamespace.Translate("hu_HU"); // példányosítottuk és átadtuk neki a locale értékét, aztán letároltuk az osztályt a trans változóba

console.log(trans.locale); // "hu_HU" 

```

Na de akkor most jöjjön az ami miatt a legtöbben felhagynak a komplexebb javascript kódok írásával, a macera. Hozzunk létre egy függvényt az adott osztály alatt!

```
<pre data-language="javascript">MyNamespace.Translate.trans = function(key) {
 // ide jön valami roppant frappáns fordítási logika
 return value;
}

var trans = new MyNamespace.Translate("hu_HU");
console.log(trans.trans(key)); // ide jönne a value, ugye?
```

Na most amikor a fenti kódot lefuttatjuk, akkor bizony szomorúan kell tapasztaljuk, hogy a programunk bizony <del>csecsre</del> hibára fut. A gond ott van, hogy a javascript másképp kezeli az objektumokat, mint azt pl. Javaban, PHP-ben megszoktuk. A fent leírt Mynamespace.Translate.trans() egy statikus metódusnak minősül, tehát amikor egy példányon akarjuk meghívni, akkor bizony nem találja a rendszer. Ahhoz, hogy ne statikus legyen és ezen a példányon megtalálja, ahhoz az adott objektum ún. prototype-ját kell <del>megb\*szatnunk</del> piszkáljuk.

Minden javascriptben példányosított objektum a példányosításkor megnézi a saját prototype-ját és az esetleges általunk beregisztrált módosításokat figyelembe véve fogja példányosítani.

Tehát a megoldás a következő lesz:

```
<pre data-language="javascript">MyNamespace.Translate.prototype.trans = function(key) { // a prototype objektumba elhelyezzük a mi kis bónuszunkat, így a példányosított osztályban már ott lesz a trans() metódus. Ez igaz a this context-ben meghívottakra is.
 // ide jön valami roppant frappáns fordítási logika
 return value;
}
```

Ezzel ugye nem csak az egyes metódusait, de példányváltozókat is beregisztrálhatunk, értéket rendelhetünk hozzá, stb. Nem a legelegánsabb megoldás, de jelen körülmények közt ezzel kell beérjük.

#### This == ?

Az iménti kódból kimaradt az a jóféle fordítási logika amit itt orvosolni fogunk. Az adott fordítási kulcs/ érték párok egy tömbben lesznek eltárolva, amin mi egy jól bevált forEach-el szimplán menjünk végig keresve az "igazit".

```
<pre data-language="javascript">MyNamespace.Translate.prototype.trans = function(key) {

Mynamespace.Translate.keys.forEach(function(elem){ // végigiterálunk egy objektumokkal teli tömbön
 if(elem.key == key) // ha megvan az elem
 this.value = elem.value; 
 });

}
```

Na most a fenti kód nekünk nem lesz jó, ugyanis a callback function scopejában létrehozott változó nem fog megjelenni a return-ben, ugyanis az nem a mi osztályunk this-ére vonatkozik, hanem a z adott tömbre.  
Ilyen esetekben létrehozhatunk egy változót, ami az osztálypéldányunkra mutat és a foreach callbacken belül használhatjuk ezt.

```
<pre data-language="javascript">MyNamespace.Translate.prototype.trans = function(key) {

var self = this; // az osztályunk referenciáját egy globális változóba tesszük

Mynamespace.Translate.keys.forEach(function(elem){ // végigiterálunk egy objektumokkal teli tömbön
 if(elem.key == key) // ha megvan az elem
 self.value = elem.value;  // a self mivel átkerült a globális scope-ba, ezért itt is elérjük és rajta keresztül a Translate osztályunknak tudunk példányváltozót beállítani
 });

}
```

#### Öröklődés

Aki elég beteg, az eljutott eddig a cikkben, annak már valószínűleg nem fogja megülni a gyomrát amikor azt mondom, igen, a javascriptben is lehet ilyet, persze a már jól megszokott <del>sajtreszelővel r\*jszolós</del> módszerrel.

Az alábbi példában létrehozok egy kaja osztályt, aztán abból leszármaztatok egy gyros osztályt (nem, nem vagyok éhes).

```
<pre data-language="javascript">var kaja = function(kaloria) { 
   this.kaloria = kaloria; // ez itt a konstruktorunk ugye
}

var kaja.prototype.zaba = function() {
   console.log("Épp most zabáltál fel " + this.kaloria + " kalóriának megfelelő kaját!");
   // itt ugye a kaja alatt hozunk létre egy metódust, tehát elérjük a kaja osztályunk this context-jét
}

var gyros = function(pitaban) {

    kaja.call(this, 500 ) // a call metódussal tudjuk meghívni a "szülő" konstruktorát, amolyan parent::__construct(). Mivel a hívás során átadjuk az objektumunk referenciáját, ezért a this context-ben fog meghívódni. 
    this.pitaban = pitaban; // a boolean pitában kérdés, amit olyan gyakran hallunk
}

// ez a tényleges öröklődés, ahol a kaja prototípusát megörökli a gyros osztályunk.
gyros.prototype = Object.create(kaja.prototype); 

// mivel a kaja osztályunknak is van constructor-a, ezért ezt vissza kell állítsuk, mielőtt példányosítanánk, mert az imént ugye felülírtuk
gyros.prototype.constructor = gyros;


var jofeleGyros = new gyros(true); // példányosítjuk a gyros osztályt

// majd leellenőrízzük, hogy tényleg végbement-e az öröklőgés
console.log(jofeleGyros instanceof gyros); // true
console.log(jofeleGyros instanceof kaja); // true
// és ellenőrízzük, hogy az örökölt metódust is megkaptuk-e
jofeleGyros.zaba(); // Épp most zabáltál fel 500 kalóriának megfelelő kaját!
```

Ha a prototype kulcsszótól már herótunk van és nem akarjuk hosszan definiálgatni a dolgot, megoldhatjuk ezt úgy is, hogy minden alkalommal prototype objektumokat adunk át:

```
<pre data-language="javascript">gyros.prototype = {
 constructor: gyros, // átadjuk ugye a constructorunkat, nehogy elvesszen
 zaba : function(kaloria) { // mennyivel jobb, szárazabb érzés, ugye?
 } 
}
```

Első körben ennyit szerettem volna kitárgyalni a JS-ről azoknak, akik még nem nagyon mélyedtek el benne, legközelebb végignézzük az egyes tervezési mintákat itt is.