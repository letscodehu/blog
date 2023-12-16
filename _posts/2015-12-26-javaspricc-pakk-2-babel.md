---
id: 895
title: 'Javaspricc pakk 2 &#8211; Babel'
date: '2015-12-26T14:18:58+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=895'
permalink: /2015/12/26/javaspricc-pakk-2-babel/
dsq_thread_id:
    - '4435363007'
    - '4435363007'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2015/12/09202000/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_Vienna_-_Google_Art_Project_-_edited.jpg'
categories:
    - Egyéb
    - JavaScript
    - Node.js
tags:
    - babel
    - build
    - ecmascript
    - es2015
    - es6
    - grunt
    - javascript
---

Az [előző ]({{ site.url }}/2015/12/24/javascript-pakk-no-1-ecmascript-6/)cikkemben szó volt az ECMAScript 6 újításairól. Itt kitértem arra is, hogy azért nem szabad rögtön fejest ugrani a dologba, lévén a böngészők támogatottsága elég vegyes. Viszont az előző szabványra már felkészültek. Emlékezzünk csak vissza a cikkre.. a legtöbb újításra volt valami megfelelő a régiben is, még ha patkolás kategóriába is esett. Nem lehetne megoldani, hogy megírom az újban és visszafelé kompatibilissá teszem?

Hát hogy a gránátba ne!?[![Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_(Vienna)_-_Google_Art_Project_-_edited](assets/uploads/2015/12/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_Vienna_-_Google_Art_Project_-_edited.jpg)](assets/uploads/2015/12/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_Vienna_-_Google_Art_Project_-_edited.jpg)

Ahhoz, hogy nekikezdhessünk a dolognak, először is szükségünk lesz a babelre, valamilyen formában. Két opció van, az egyik csak backendre illeszthető, ún. require-hook, ami annyit tesz, hogy a node.js által behúzott fájlokat leforgatja. A másik, ami nekünk a frontenden is jó lesz, az a CLI tool, amivel parancssorból lehet átforgatni fájlokat.

#### Babel-CLI

A babelhez mindenképp szükségünk lesz egy node/npm kombóra a gépünkön.

Utána tudjuk telepíteni is:

```
<pre data-language="javascript">npm install --save-dev babel-cli
```

Ezzel bármelyik projektünkbe tudjuk telepíteni azt.

> Nem érdemes globálisan telepíteni, lévén a szabvány különböző elemeit konfigurálni kell és ezek csúnyán összeakadhatnak a projektek közt

Ha ezzel megvolnánk, akkor elméletben már készen is állunk arra, hogy leforgassunk egy kódrészletet.

A parancssori tool viszonylag egyszerűen kezelhető.

Hozzunk is létre a projektünkben egy src és egy dist mappát. Ez előbbi tartalmazza majd az ES6-os forrást, míg az utóbbiba kerülnek majd a lefordított és minifikált fájlok. Akkor csináljunk egy post.js-t, amiben a legfincsibb újdonságok egyikét fogjuk kipróbálni, mégpedig a class definitiont:

```
<pre data-language="javascript">class Post {
   constructor(title, content, slug) {
      this.title = title;
      this.content = content;
      this.slug = slug;
   }   
}
```

Akkor most nézzük meg, hogy működik-e a cucc:

```
<pre data-language="javascript">babel src -d dist
```

A fenti parancs az src mappában található scripteket a dist mappába forgatja le. Adjuk hát ki a parancsot és nézzük meg a kimenetet!

Ő... ez tök ugyanaz. Valami gond van? Na jó.. valami gond van.[![fullretard](assets/uploads/2015/12/fullretard-1024x559.jpg)](assets/uploads/2015/12/fullretard.jpg)

A korábbiakban említettem, hogy a fordítót konfigurálni kell, ez pedig az egyes szintaktikákra vonatkozik, mert nem csak ES6-ról es ES5-re lehet alakítani a dolgot, hanem többféle szintax közti átjárást biztosít, akár csak a szintax egyes részeire vonatkozólag is. Ezeket ún. pluginekkel tudjuk lehetővé tenni, amiből a babel 6-os verziójáig a legtöbb default be volt kapcsolva. Viszont mostantól nekünk kell ezeket bekapcsolni.

#### .babelrc

Hozzuk hát létre a .babelrc fájlt a projektünk gyökerében. Ez egy szimpla JSON formátumú fájl, hasonló a package.json-höz.

```
<pre data-language="javascript">{
 "plugins": ["transform-react-jsx"], // a plugineket itt lehet megadni
 "ignore": [ // ignore listre tehetünk bizonyos fájlokat, amiket nem forgat át a rendszer
 "foo.js",
 "bar/**/*.js"
 ]
}
```

Sőt, akár a package.json-be is beágyazhatjuk a .babelrc konfigurációját:

```
<pre data-language="javascript">{
 "name" : "Babel-teszt",
 "version" : "1.0.0",
 "babel" : {
      // a babelrc tartalma
   }
```

```
}
```

Na de akkor mostmár nem ártana dologra fogni a cuccot, nemde? Mivel mi ES6-ról szeretnénk ES5-re alakítani, telepítsünk hozzá plugineket:

```
<pre data-language="shell">npm install babel-plugin-syntax-constructor-call
```

> Figyelem: a fenti plugin csak annyit tesz lehetővé, hogy a babel felismerje az új constructor syntax-ot, viszont azt nem tudja hogy is kellene átalakítani azt

Mivel elég sok újdonság jött a nyelvvel, ezért jobban járunk, ha ún. presetet telepítünk, amiben összecsomagolva ott vannak a nekünk szükséges parser/transform pluginek:

```
<pre data-language="shell">npm install babel-preset-es2015
```

Ez ugye csak elérhetővé teszi a preset-et, viszont meg kell mondjuk a babelnek, hogy bizony használja is azt, a package.json-ben (vagy .babelrc fájlban):

```
<pre data-language="javascript">{
   "babel" : {
       "presets" : ["es2015"]
    }
}
```

Ha ezzel megvolnánk, akkor elvileg minden készen áll a magicre, adjuk ki hát ismét a parancsot:

```
<pre data-language="shell">babel src -d dist
```

Most némileg tovább szüttyög a fordítás, és ennek meg is lesz a gyümölcse! Nézzük meg a leforgatott fájl tartalmát:

```
<pre data-language="javascript">"use strict"; // strict mode on

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // definiál egy ún. ellenőrző függvényt, amivel meggátoljuk, hogy a konstruktor függvényünket sima függvényként hívjuk meg, a new kulcsszó használata nélkül.

var Post = function Post(title, content, slug) { // az ősi "konstruktor" definíció
 _classCallCheck(this, Post); // itt ellenőrízzük is a dolgot

 this.title = title;
 this.content = content;
 this.slug = slug;
};
```

Ez utóbbi kódban már nem lesz olyan syntax, amit ne tudna megemészteni a legtöbb böngésző, így ezzel meg is volnánk. Na de mégis hogy is kellene mindezt alkalmazni? Ugye a fejlesztés alatt mi lehetőleg olyan böngészővel fogunk dolgozni, ami támogatja már az újabb syntaxokat is, így ez inkább a production build folyamat során kellene lefusson.

> Aki PHPStormot használ, ne fusson bele abba a hibába, hogy egy sima filewatchernek felveszi a babelt, mert megeszi a gépét reggelire 🙂

Akkor nézzük a legegyszerűbb módszert erre. Az első ilyen egy sima package.json-be suvasztott script lesz.

```
<pre data-language="javascript">{
 "scripts" : { // a package.json-ben lehet az adott projektre specifikus scripteket felvenni, amiket az npm-el tudunk majd futtatni
    "build" : "babel src -d dist" // a parancs a kulcs, ami pedig lefut az az értékben lesz, tehát az npm run build-re fog hallgatni
   }
}
```

Persze tovább is lehet mindezt piszkálni, mert szeretnénk ha az output pl. kommentektől mentes legyen:

```
<pre data-language="shell">babel src -d dist --no-comments
```

Valamint tuningoljuk tovább a dolgot egy kis minifikálással:

```
<pre data-language="shell">babel src -d dist --no-comments --minified
```

Ez se volt túl bonyolult nem? Akkor most nézzük meg az egyik népszerű task runnerrel/build systemmel is:

#### Grunt[![Grunt](assets/uploads/2015/12/Grunt.jpg)](assets/uploads/2015/12/Grunt.jpg)

A grunthoz is lehet babel plugint szerezni, ami a build folyamat során hasznunkra lehet:

```
<pre data-language="shell">npm install --save-dev grunt-babel
```

Ezzel megszereztük a babel plugint az adott projektre. Persze szükség van még lokálisan egy gruntra és globálisan a grunt-cli-re is.

Na de nézzük, mit is kell beleoktrojálnunk a gruntfile-unkba?

```
<pre data-language="javascript">module.exports = function(grunt) { // a wrapper function
 require("load-grunt-tasks")(grunt); 

 grunt.initConfig({ 
    "babel": { // a babel related konfiguráció
        options: {
          sourceMap: true
        },
        dist: { // a fájlokra vonatkozó konfig
           files: { 
            "dist/post.js": "src/post.js" // a dist/post.js fájlt az src/post.js fájlból fogja forgatni
           }
        }
    }
 });

 grunt.registerTask("default", ["babel"]); // majd beregisztráljuk a taskot
};
```

Nézzük, hogy a grunt parancs mit produkál:

```
<pre data-language="shell">Running "babel:dist" (babel) task
Done, without errors.
```

[![future](assets/uploads/2015/12/future-1024x576.jpg)](assets/uploads/2015/12/future.jpg)Ezzel meg is volnánk. Remélem sikerült ismét egy lépéssel lendíteni a "jövő" felé.