---
id: 909
title: 'Javascript pakk 3 &#8211; Kinek kell a JS?'
date: '2015-12-30T01:24:44+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=909'
permalink: /2015/12/30/javascript-pakk-3-kinek-kell-a-js/
dsq_thread_id:
    - '4445253498'
    - '4445253498'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2015/12/09202009/c%C3%A9lt%C3%A1bla.jpg'
categories:
    - Frontend
    - JavaScript
tags:
    - dependency
    - file
    - javascript
    - loader
    - management
    - module
    - requirejs
    - tree
    - tutorial
---

Azt már az [előző]({{ site.url }}/2015/12/24/javascript-pakk-no-1-ecmascript-6/) cikkemben is említettem, hogy bizony frontendesnek lenni nem <del>csak a húszéveseké</del> fenékig tejfel. A böngészők, habár okosak, mindent nem tudnak helyettünk, főleg azért, mert a HTML nem programnyelv, hanem amint a neve is mondja, sima leíró nyelv, ezért habár ezen is mindig csiszolnak picit, a lehetőségek korlátozottak. Az egyik ilyen problémát jelenti például az, hogy rengeteg külső libet használunk, össze-vissza és néha már azt se tudjuk melyik mikor is töltődött be, hiszen itt jön a poén, hogy bizony bele kell kalkulálni azt is, amíg lejön. Szerencsére erre gondoltak, amikor különböző eventeket hajigált a dokumentum, de továbbra se ment meg bennünket attól, hogy olyan dolgokra hivatkozzunk, amik akkor még a böngészőnk JS motorja számára nem ismerős:

```
Uncaught ReferenceError: jQuery is not defined(…)
```

Persze más programnyelvekben is ismerős lehet mindez, dobhat kivételt a ClassLoader, jöhet egy Class not found hibaüzenet, és még sorolhatnám. Persze ez utóbbiakat egy autoloader, vagy az artifactba foglalás megoldja, de mi a helyzet a javascript frontján? Ebben nyújt nekünk segítséget a [RequireJS](http://requirejs.org/)

[![céltábla](assets/uploads/2015/12/céltábla-1024x656.jpg)](assets/uploads/2015/12/céltábla.jpg)

A require JS egy fájl és modulbetöltő tool, ami főleg akkor lehet hasznunkra, mikor már szép lassan kezdünk elveszni a JS fájlok rengetegében, több aloldalon többféle library-ra van szükségünk és különben is, miért nincs itt is autoload? Akkor nézzük most működés közben a dolgot. Ugye a fájlokat ugyan betölti a böngészőnkben (egyébként böngészőn kívül is használható, de mi most erre nem fogunk kitérni), de azoknak először is ott kell lenniük, mindent nem tesz meg helyettünk a cucc<del> hiszen a lóf\*sznak is van ám vége, ugye?</del>. Itt jön segítségünkre majd pl. a bower.

> Másik nagy előnye még a requireJS-nek, hogy a fájlok/modulok betöltését aszinkron végzi, ezáltal nem lassítja az oldal betöltődését, ami miatt pl. a google is szeretni fog minket.

Mit is szedjünk le? Jöjjön először a tipikus bootstrap, aminek a függősége lesz ugye a jQuery (amit a bower már a package infókból kiindulva leszed nekünk), majd lévén erről szól a cikk, szedjük le a requirejs-t is.

```
bower install bootstrap requirejs
```

Bowerrc fájl hiányában a bower\_components mappában már ott is figyel a három komponensünk, amiket majd igénybe vehetünk. Tudom, hogy már mindenkinek a könyökén jön ki, de az eredeti módszert is megmutatom, mert később ahogy projektünk bővül, jól látható lesz majd mennyiben másabb a dolog így requireJS-el.

```
<html>
<head>
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css" /><!-- bootstrap css -->
</head>
<body>
<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script><!-- szokásos zsékveri -->
<script type="text/javascript" src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script><!-- hozzá pedig a bootstrap JS, szigorúan utána -->
</body>
</html>
```

Na, akkor most nyissuk meg a fenti html-t egy böngészőben. Minden css és js frankón betöltődött. Mindenki mehet haza, nincs itt semmi látnivaló, jó ez így, nem? Ha valóban ennyivel meg tudjuk oldani a dolgot, akkor tényleg nem kell bonyolítanunk, de maradjunk az egyszerű példáknál, így nézzük meg ezt is requireJS-el. Ahhoz, hogy mindezt életre leheljük, be kell hívnunk a hozzá tartozó Javascript fájlt. Utána több módon lehet beröccenteni a dolgot. Mi most az ún. data-main attribute módszert fogjuk használni. Ez arról szól, hogy a body végén behúzzuk a requireJS-t és az őt behívó script tag data-main attribútumának átadjuk a fő konfigurációs fájlunk elérési útját. Ezt az benyalja, és bumm, már kész is.. már ha nem hülyeségeket írtunk bele:

```
<html>
<head>
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css" /><!-- bootstrap css, mi alapjáraton a JS-eket húzzuk be, de később kitérek erre is -->
</head>
<body>
<script type="text/javascript" src="bower_components/requirejs/require.js" data-main="app/main.js"></script><!-- a requireJS bootstrapje, az app/main.js-ben található a konfig -->
</body>
</html>
```

Akkor most hozzuk létre az app/main.js-t is, egyelőre csupán ennyivel:

```
require.config({});
```

Majd frissítsük a böngészőnket és.. nem történt semmi, lévén nem monduk meg a requireJS-nek, hogy mi legyen, viszont ha megnézzük, akkor azt láthatjuk, hogy async script tag-ként megjelent a headben a fentebb említett main.js.[![its_working_star_wars](assets/uploads/2015/12/its_working_star_wars.gif)](assets/uploads/2015/12/its_working_star_wars.gif)

De akkor most tegyünk is valamit a haza érdekében, mókoljunk egy picit a konfigokkal. Azt már láthattuk, hogy objektumot vár paraméterként. Annak pár igen fontos mezője lesz. A baseUrl, paths és shim.

A baseUrl egy alap prefixet fog adni minden behívott fájl elé. Ez akkor jó, amikor a konfigban nem akarjuk felvenni az összes fájlunkat és ahhoz valami aliast rendelni, hanem szinte minden behívott fájl egy könyvtárba tömörül. Így ha pl. a baseUrl a "bower\_components", akkor azzal prefixálva is megpróbálja behívni a fájlokat.

A paths egy kulcs-érték gyűjtemény lesz, ahol a kulcsok az egyes aliasok, míg az értékek az elérési utak lesznek, a ".js" zárótag nélkül.

> **Fontos**: a requireJS autentikusan becache-eli a dolgokat, tehát egy futás alatt sosem fog kétszer behúzni egy fájlt, hacsak nem aliasoztunk többször ugyanarra a fájlra

A shimben lehet az egyes aliasokhoz megadni a függőségeket, export változót, stb.

Na de nézzük meg, hogy is megy ez a gyakorlatban!

```
require.config({
  "baseUrl": "bower_components", // megadtuk, hogy a bower_componentsben keresse a dolgainkat (persze kipróbálja prefix nélkül is)
   paths : {
    "jquery" : "jquery/dist/jquery.min", // a jquery-re létrehoztunk egy alias-t, lévén a baseUrl megvan, bower_components már nem kell elé
    "bootstrap" : "bootstrap/dist/js/bootstrap.min" // ugyanezt megtettük a bootstrap-el is
  },
  shim : { 
     "bootstrap" : { // a bootstrap függősége a jquery
       "deps" : ["jquery"] // itt a deps-nél egy tömbben tudjuk megadni az egyes függőségeket. Itt megadjuk, a jquery alias-t, így a bootstrap előtt azt húzza be
     }
  },
  "deps": ["bootstrap"] // végül megadjuk az app-unk fő függőségét, a bootstrap-et.
});
```

Akkor most a fenti konfiggal nézzük meg mi történik. Ha semmit nem írtunk el, akkor a szokásos semmi, de ezt egy bootstrap specifikus elemmel le tudjuk tesztelni (vagy megnézzük a devtools-t, de az buzis). Adjuk hozzá a body-hoz a következőt:

```
<a id="teszt" class="btn btn-default">Teszt</a>
```

Nos a fenti példa ugyan működik, bootstrap-like lett a gomb, de önmagában sokra még nem megyünk vele, lévén mi magunk is fogunk JS-t hákolni, így azt is be kéne húzni, nem? Hozzuk létre az app/index.js-t és ha már van jQuery, akkor írjuk át a gomb szövegét, lássuk az is működik-e:

```
$("#teszt").html("Ha ez megy akkor minden");
```

De ahhoz, hogy ez az index.js is bekerüljön a rendszerbe, a requireJS-nek be kell húznia azt, méghozzá úgy, hogy a bootstrap és a jQuery is betöltődjön előtte, nemde? Írjuk hát át a konfigot ennek megfelelően:

```
require.config({
   "baseUrl": "bower_components",
    paths : {
     "jquery" : "jquery/dist/jquery.min",
     "bootstrap" : "bootstrap/dist/js/bootstrap.min",
     "index" : "../app/index" // mivel ez nem a bower_componentsben van, ezért vissza kell lépni 1 szinttel 
    },
   shim : {
    "bootstrap" : {
     "deps" : ["jquery"]
       },
    "index" : { // az aliasunk konfigja
      "deps" : ["bootstrap"] // mégpedig ő a bootstrap-től függ (az pedig majd a jQuery-től)
       }
    },
    "deps": ["index"] // változott a terv, az index lesz amit behúzunk
});
```

Na és nézzük meg mi is történik most.. Bumm.. ismét működik a fogat. Remélhetőleg mindenki mást is érdekel, hogy mégis miféle feketemágia mozgatja a dolgokat a háttérben. Nos a helyzet az, hogy a requireJS beolvassa a konfigot, aztán meglátja benne a függőségek közt az index-et. Elkezdi keresni a fájlt a paths-ban, aztán megleli és megnézi a shim-ben, hogy van-e valami amit tudni kellene róla. Ott meglátja, hogy hoppá, ennek függősége a bootstrap alias. Akkor megkeresi azt is és utána annak is a shim-jét, amiben látja, hogy az meg a jquery-t akarja. Azt megleli a paths-ban, és mivel annak nincs más beállítása, megpróbálja betölteni. Miután azt sikerült, akkor betölti a bootstrap-et, majd végül az index.js-t. Hoppá, függőségi fát építettünk![![tree-451x320](assets/uploads/2015/12/tree-451x320.png)](assets/uploads/2015/12/tree-451x320.png)

Viszont valami még mindig nem kóser. Emlékeztek a gonoszra, a kopasz csúf noConflict mode-ra? Ugye több javascript lib is használja a $-t mint változó vagy függvény. Hogy lehetne ezt a névütközést elkerülni mindenféle noConflict és hasonlók nélkül? Ezekre is lehetőséget biztosít a requireJS, ugyanis nem kell többé bemocskolnunk <del>senki nevét</del> a globális névteret.

#### Define

Ugye ami a globális névtérben történik, az a globális névtérben is marad<del> egészen a delete meghívásáig, de ezt most hagyjuk</del>. Ahhoz, hogy ezt elkerüljük, függvényekbe csomagoljuk mindazt, amink van. Mindezt meg tudjuk tenni a requireJS-el is, mégpedig nem is akárhogy. A függőségekből exportált modulokat különböző változóneveken át tudjuk adni a kódunknak. Erre szolgál lehetőséget a define függvény, aminek első paramétere a függőségek azonosítóiból álló tömb, a második paraméter pedig egy callback function, ami szépen sorban megkapja a modulokból exportált változókat. Nézzük akkor ezt a gyakorlatban, nyissuk meg az index.js-t:

```
define(["jquery"], // a jquery-re van itt szükségünk. Ez ne tévesszen meg senkit, ez nem egyenlő azzal, amit a konfigban megadtunk. Itt is lehet függőségeket megadni, így ha pl. a konfigban ezt nem tesszük meg, akkor ugyanúgy behívásra kerülnek az itteni alias-ok, azzal a különbséggel, hogy itt átadhatjuk őket paraméterként.
function(zsekveri) { // paraméterként átadtam a jquery-t, így zsekveri-ként lehet rá hivatkozni
 zsekveri("#teszt").html("Működik a zsékveri!");
});
```

Ha ráfrissítünk az oldalra, akkor örömmel tanusíthatjuk, hogy a feketemágia hatott, zsekveriként is lehetett hivatkozni rá, viszont ez nincs kihatással a globális névtérre, csak az adott callback-ben működik mindez.

#### Bonyodalom

Azonban ez még mindig semmiség, hiszen melyik az az oldal, ahol mindent egy js-be bele tudunk (vagy inkább akarunk?) zsúfolni. Legyen szó például egy admin felületről, ahol lehetőségünk van teljesen különböző aloldalakra navigálni.[![csoda](assets/uploads/2015/12/csoda.png)](assets/uploads/2015/12/csoda.png)

Szedjük le hozzá a C3-at és a CKEditort.

```
bower install c3 ckeditor
```

Hozzunk létre az app könyvtárban három új fájlt. Az egyik a common.js legyen, ez lesz az adminfelület egészére érvényes javascript. Legyen egy blog.js, ahol a blogbejegyzéseket tudjuk majd szerkeszteni. Ehhez kell majd a CKEditor is, majd legyen egy message.js, ami a rendszerüzenetekért felelős aloldalunkhoz tartozik. A C3 pedig az index.js-hez tartozik majd, hisz a dashboard lesz tele shiny diagramokkal, nemde?

Az újonnan létrehozott js fájlokba másoljuk át az index.js-ből található kis kódrészletet, azzal a különbséggel, hogy a gomb feliratát az adott aloldal nevét adjuk meg.

A könyvtárszerkezetünk így a következő:

```
app/
    index.js
    common.js
    message.js
    blog.js
    main.js
bower_components/
    ...
```

Ha ezzel megvónánk' akkor jöhet az a bizonyos konfig fájl:

```
require.config({
      "baseUrl": "bower_components",
      paths : {
        "jquery" : "jquery/dist/jquery.min",
        "bootstrap" : "bootstrap/dist/js/bootstrap.min",
        "index" : "../app/index",
        "common" : "../app/common", // az általános dolgok, amik az admin felület egészén kellenek
        "message" : "../app/message", // az üzenetek küldéséért felelős cucc
        "ckeditor" : "ckeditor/ckeditor", // a wysiwyg szerkesztőnk
        "blog" : "../app/blog", // a blog aloldalhoz a dolgok 
        "c3" : "c3/c3.min", // a diagramokért felelős lib
        "d3" : "d3/d3.min" // a C3 a D3 libre épül, így meg kell mondjuk merre találja
       },
       shim : {
       "message" : {}, // csak a teljesség kedvéért, itt ehhez nem kell semmi más
       "blog" : {
            "deps" : ["ckeditor"]  // kell egy wysiwyg editor
          },
       "bootstrap" : {
            "deps" : ["jquery"]
          },
       "index" : {
            "deps" : ["c3"] // a főoldalt lesznek a shiny diagrammok, ehhez kell a C3
          }
       },
       "deps": ["bootstrap", app, "common"] // az app változót HEAD-ben fogjuk megadni CDATA-ként, persze vannak nála ortodoxnál ortodoxabb módok
       // a common és a bootstrap pedig minden aloldalra kell
});
```

Ahhoz, hogy mindezt működésre bírjuk, elég lesz a backendről egy változót generáljunk a head-be script tag-ek közé, hogy azt a konfignak át tudjuk adni. Viszont lévén most HTML-el van dolgunk, simán írjuk be azt:

```
<script>
/* <![CDATA[ */
var app = "blog";
/*]]> */
</script>
```

Ha mindent jól csináltunk, akkor most lefrissítve az oldalt a gomb felirata az lesz, amit a blog.js-ben megadtunk és a script-ek közt megtaláljuk a CKEditort. Ha átírjuk a fenti változó tartalmát pl. index-re, akkor annak függvényében változnak a dolgok. Elértük, hogy egy fájlban vannak menedzselve az egyes függőségek és nem okádtuk tele a view fájlokat, meg backendből generáltuk és hasonlók. Viszont a kérdés a CSS-ek terén továbbra is fennáll. Az egyes könyvtárspecifikus CSS-eket hogy tudjuk behúzni? Mivel ez aszinkron történik, ezért itt nem árt egy preloadert elhelyezni, mert idő, mire elér oda, hogy CSS-t is behúzzon. Erre pedig a következő JS függvény lesz alkalmas, mivel sajna a requireJS nevéből adódóan <del>és böngészőkompatibilitási okokból</del> a CSS-eket nem húzza be helyettünk:

```
function loadCss(url) {
 var link = document.createElement("link");
 link.type = "text/css";
 link.rel = "stylesheet";
 link.href = url;
 document.getElementsByTagName("head")[0].appendChild(link);
}
```

Az, hogy ezeket a CSS-eket aszinkron húzzuk be, vagy épp mikor az már csak rajtunk áll, de számoljunk vele, hogy netsebességtől függően ezekre akár másodperceket is kell várni.

Nos remélem sikerült némileg közelebb hozzalak benneteket a requireJS világához, ha pedig kérdésetek van, nyugodtan véssétek kőbe pár görgetéssel lejjebb!

</body></html>
