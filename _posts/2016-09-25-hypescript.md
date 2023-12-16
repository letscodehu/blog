---
id: 1278
title: HypeScript
date: '2016-09-25T14:02:30+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1278'
permalink: /2016/09/25/hypescript/
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
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/09/09202258/typescript-cover-image.jpg'
categories:
    - JavaScript
    - Node.js
tags:
    - javascript
    - typescript
---

A múltkori [mobilos]({{ site.url }}/2016/09/18/cross-platform-mobilosodas-2-resz/) cikkre megkaptam, hogy inkább az Ionic 2-re vagy React Native-ra kellene fókuszálnom. A dolgot megfogadom, ám ahhoz, hogy az Ionic 2-re rátérhessünk, nem ártana végigjárni az utat hozzá. Ehhez az első lépés a typescript lesz, utána jöhet az Angular2, majd az Ionic 2/Electron és/vagy a Unity-re is sor kerülhet, C# helyett typescript alapon.

[![typescript-cover-image](assets/uploads/2016/09/typescript-cover-image-1024x530.jpg)](assets/uploads/2016/09/typescript-cover-image.jpg)

Na most mi is az a typescript, miért is jó nekünk és miért is lesz rá szükségünk a későbbiekben?

Haladjunk szép sorban a válaszokkal: A TypeScript a JavaScript egy úgynevezett supersetje, tehát a JavaScript kibővítése, típusokkal felvértezve és ami a lényeg, hogy sima mezei JavaScriptre fordul, amit a böngészők szó nélkül megesznek.

*Fordul??*

Igen, a TypeScriptben írt kódot le kell fordítanunk, ami ugyan nem egy gradle build, hogy percekig tartson, de legalább elindultunk a fordítások közti index olvasás rögös útján.

Na de miért is jó nekünk?

[![Br00TCn](assets/uploads/2016/09/Br00TCn.gif)](assets/uploads/2016/09/Br00TCn.gif)

Próbáltunk már komolyabb applikációt írni JS-ben, pl. ES5 alatt? Hány perc után fogott el a sírógörcs? Persze levetkőzhetjük a logikát, hogy backendesek szívjanak (viva la vékonykliens), de ha az éppen node.js, akkor bizony ígyis-úgyis szembesülnünk kell a ténnyel, hogy szükségünk van némi segítségre, hogy átlássuk a dolgokat. Bevezethetünk module loadereket, szétdarabolhatjuk az applikációt, viszont akkor a sok kis apró elemet lesz nehéz fejben összekötni, komolyabb változtatásokat végigvezetni azokon egy gombnyomással. Mégis hogy segíthet nekünk a típusok bevezetése? Nos az első ilyen lépés az pont ez, ugyanis ezáltal sokkal jobb kódkiegészítést kapunk, kontextusba illőt, a másik a refaktoring lehetősége, lévén az IDE végig tudja követni, hogy milyen objektumok merre járnak, adott tagváltozók nevét nem hasraütésszerűen kell kitalálnia, de erre még később visszatérünk.

Na és miért is kell? Azért, mert<del> ez a szomorú jövő</del> több helyen is hasznát vesszük. Az Angular2 esetében (mondjuk itt nem csak ez az egy opció) úgy mint az Ionic 2 esetében is, de ha valakit a játékfejlesztés inkább érdekel (itt nyerek olvasókat, jeee! ), akkor ott C# mellett a TypeScript is opció, amiben scriptjeinket írhatjuk.

Na de sok volt a beszéd, inkább nézzük meg mi is ez az egész!

Ahhoz, hogy működjön a dolog, első körben szükségünk lesz a typescript npm csomagjára:

```
<pre data-language="shell">npm install -g typescript
```

És bumm, kész is vagyunk, mehetünk haza!

Sajnos ez nem lesz ilyen egyszerű, ezért most mindenki platformtól függően keressen valami olyan IDE-t, ami támogatja a typescriptet. WebStorm, Visual Studio, VS Code, stb. elég sok editor támogatja már. A példákban a képek a <del>csodás</del> VS Code-ból valóak lesznek. Emlékszünk még az [ES6]({{ site.url }}/2015/12/24/javascript-pakk-no-1-ecmascript-6/) syntaxra? Sokban hasonlítani fogunk arra:

```
<pre data-language="javascript">class Starter {
}
```

Ezt mentsük le egy starter.ts fájlba, majd fordítsuk le és nézzük mi is lesz belőle!

```
<pre data-language="shell">tsc starter.ts
```

> Alapesetben ugyanoda fogja fordítani a fájlokat, de később majd megnézzük, hogy is lehet konfigurálni a typescript compilerét.

A generált fájl a starter.js lesz:

```
<pre data-language="javascript">var Starter = (function () {
 function Starter() {
 }
 return Starter;
}());
```

Hát nem mondanánk valami szépnek, ugye? Na de az imént típusokról volt szó, nemde? Akkor nézzük csak miről is volt szó!

```
<pre data-language="javascript">class Starter {
  private startingNumber : number;
 
  public constructor(startingNumber : number) {
    this.startingNumber = startingNumber;
  }
}
```

Hirtelen felvettünk pár plusz elemet a dologba. Először is hozzáadtunk az osztályunkhoz egy privát fieldet, ami number típusú, létrehoztunk egy konstruktort, ami ezt beállítja. Nézzünk mi is lesz ebből a generált kódban:

```
var Starter = (function () {
 function Starter(startingNumber) {
 this.startingNumber = startingNumber;
 }
 return Starter;
}());
```

Ööö.. hol a privát field, hol vannak a típusok? Nos a helyzet az, hogy a javascriptben nincsenek a access modifierek, ennélfogva azokat nem lehet ábrázolni ott. Tehát ott nem fognak megjelenni. Típusok sincsenek, tehát azok se jelennek meg.

**Akkor mégis mi értelme ennek?**

[![Selection_026](assets/uploads/2016/09/Selection_026.png)](assets/uploads/2016/09/Selection_026.png)

Próbáljuk meg pl. stringet átadva a konstruktornak példányosítani az osztályunkat:

```
starter.ts(8,25): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

Hát igen, a compiler bizony beszól, hogy nettó f\*szság amit épp tenni próbálunk (ennek ellenére persze lefordítja az egészet...), valamint az IDE is észreveszi, hogy valami nem kóser. Akkor most nézzük az access modifiereket! A startingNumber ugye privát, ennélfogva nem kéne kívülről elérni, nemde?[![Selection_027](assets/uploads/2016/09/Selection_027.png)](assets/uploads/2016/09/Selection_027.png)

Hát nem kell félteni a rendszert, ezért is ugyanúgy beszól. Hmm, így talán lehet normális rendszereket tervezni? Azt már látjuk, hogy az access modifiereket figyelembe veszi a rendszer, valamint lehet classokat deklarálni.

Mi az helyzet az interfészekkel?

Na ez egy kicsit más tészta, mint amit más nyelvekben láthattunk, ugyanis az interfészeket nem kell implicit implementálnunk, elég ha a belső szerkezete hasonló:

```
<pre data-language="javascript">interface Rucsok {
 hoursSlacked : number;
}

class Starter { // kicsit átformáltuk a dolgokat
 private rucsok : Rucsok;
 public constructor(rucsok : Rucsok) {
 this.rucsok = rucsok;
 }
}

var rucsok = {hoursSlacked : 6}; // anonym object, de ugyanazokkal a fieldekkel rendelkezik, mint a Rucsok interfész, ennélfogva kompatibilis

var start = new Starter(rucsok);
```

A fentiekben kissé átírtuk a dolgokat, létrehoztunk egy Rücsökinterfészt, aminek lett egy number típusú fieldje. Ezt várja konstruktorban a Starter. Mi azonban csak egy szimpla anonym objectet adunk át, aminek a fieldjei ugyanazok, így mégis megeszi azt.

Ha lefordítjuk, láthatjuk, hogy az interfészünk sehol sem szerepel, mert ez csak a typescriptben létezik, valamint a funkciója is némileg eltér más nyelvekben alkalmazott interfészektől.

Na de ha már típusok, milyen típusokat ismerünk?

**boolean:**

```
<pre data-language="javascript">let b : boolean = true;
```

Hé, álljunk csak meg egy szóra! Mi ez a let? hát nem a var kulcsszóval tudunk változót deklarálni? De igen, azonban a var scopingja nem az igazi, ennélfogva ha ún. block scopingot szeretnénk a változónknak, akkor a let kulcsszóval érdemes azt tenni. Később még kitérünk a kettő közti különbségre.

**number:**

```
<pre data-language="javascript">let workHours : number = 8;
```

A number, ugyanúgy ahogy a sima JavaScriptben, floating point, annyi, hogy a sima decimális és hexa forma mellett oktális és bináris formában is megadhatjuk azt.

**string:**

```
<pre data-language="javascript">let joker : string = "Why so serious?";
```

Ez még semmi extra, viszont bejöttek az ún. template stringek, amik az eddigi összefűzögetést hivatottak kiküszöbölni. Ezeket nem simple/duble quote-al tudjuk meghatározni, hanem az ún. backquote-al (`). Bennük változókat is meghatározhatunk, mégpedig a ${ expression } szintaxissal. A másik plusz, hogy több soron átívelhetnek, ellenben az eddigi string literálokkal, amiket soronként le kellett zárni és + jelekkel összefűzni.

**template string:**

```
<pre data-language="javascript">let quote : string = `- ${ joker },
  let's put a smile on this face!`;
```

Eddig még semmi varázslat nem történt, nézzünk a tömbökkel mi a helyzet?

**array:**

Na most hasonlóan pl. a C#-hoz, tömböt a \[\]-val fogjuk jelölni, ígye:

```
<pre data-language="javascript">let fibonacci : number[] = [0, 1, 1, 2, 3, 5, 8];
```

A másik megadási mód már sokkal fancybbnek hat, mégpedig generikus Array objektumként:

```
<pre data-language="javascript">let fibonacci : Array<number> = [0,1,1,2,3,5,8];
```

> Bizony, lesznek itt generikusok is, de erre majd még visszatérünk!

**tuple:**

Na ez miféle csodabogár?

Ebben az esetben egy olyan tömböt szeretnénk deklarálni, amiben bizonyos indexekhez fix típust rendelünk. Például akarunk egy string-string párost:

```
<pre data-language="javascript">let entry : [string, string];

entry = ["Star", "Wars"]; // funktzioniert

entry = ["Star Wars", 7]; // csecsre fut

```

Amikor kikérjük az elemet az adott indexen, akkor a fordító tudni fogja, hogy milyen típust is ad vissza. Ha olyan elemet hívunk meg, amit nem határoztunk meg, akkor egyfajta uniót képez a típusok között:

```
<pre data-language="javascript">let entry : [string, number];

entry[5] = "yepp"; // string, belefér

entry[5] = 0b001; // number, belefér

entry[5] = true; // csecsre fut, mert (string|number) constraintnek nem felel meg
```

A típus uniókba egyelőre ne menjünk bele, az egy elég advanced topic.

**enum:**

Hohohó, lassan már Java ez, nem is JS, nemde?

Ez egy teljesen új típus, ami nem létezik JavaScript alatt, ezért egy furcsa objektumszerkezettel írja le fordítás után:

```
<pre data-language="javascript">enum Situation {BAD, WORSE, WORST}

let szitu : Situation = Situation.BAD;
```

Ebből a fordítás után a következő JS kód keletkezik:

```
<pre data-language="javascript">var Situation;
(function (Situation) {
 Situation[Situation["BAD"] = 0] = "BAD";
 Situation[Situation["WORSE"] = 1] = "WORSE";
 Situation[Situation["WORST"] = 2] = "WORST";
})(Situation || (Situation = {}));
var szitu = Situation.BAD;
```

Azért így történik, mert nem csak a kulcs alapján, de index alapján is elérjük az értékeit egy enumnak. Alapesetben a hozzárendelt értékek 0-tól indexeklődnek, de mindezt felülbírálhatjuk:

```
<pre data-language="javascript">enum Situation {BAD = 42, WORSE = 75, WORST = 88 }
```

A fentiek főleg ott használhatóak, ahol már meglévő TypeScript kóddal lépünk kapcsolatba, azonban a legtöbb esetben sima JS third party library-kat és hasonlókat is használunk, amikhez nincs ún. definition fájl (majd erről is beszélünk) és ennélfogva az ott szereplő típusokról gőzünk sincs. Ekkor jön képbe az ún. **any** típus.

Ezt akkor használjuk, amikor az adott változó típusellenőrzését a compiler figyelmen kívül hagyja:

```
<pre data-language="javascript">let someJQueryStuff : any = $("#whatever");
someJQueryStuff = 36;
someJQueryStuff = "how about no?";
```

Jól látható, hogy bármit is rendelünk hozzá, nem fog beszólni a compiler. Itt ránkbízza a dolgot a compiler, tehát észnél kell lenni, hogy mi is történik. Tömbökre is alkalmazható:

```
<pre data-language="javascript">let couldBeAnything : any[] = [5, "string", false];
```

Akkor most jöjjön, ami pont az any ellenkezője, a **void** "típus":

[![TheVoid](assets/uploads/2016/09/TheVoid-1024x576.jpg)  ](assets/uploads/2016/09/TheVoid.jpg)

Amikor egy metódusunk nem tér vissza semmivel, akkor alkalmazzuk a void típust. Ezt nem lehet változóhoz rendelni, hanem függvény visszatérési értéknek:

```
<pre data-language="javascript">function wontReturnAnything() : void {
  return;
}
```

Ha megpróbáljuk mégis megerőszakolni a dolgot, akkor biza hibát dob:[![Selection_028](assets/uploads/2016/09/Selection_028.png)](assets/uploads/2016/09/Selection_028.png)

Vannak még más speciális típusok ha visszatérési értékekről van szó. Az egyik ilyen pl. a **never** lesz. Ez a VS Code által használt TypeScriptben még nem lesz benne, ezért[ felül kell csapni a használt SDK](https://code.visualstudio.com/docs/languages/typescript#_using-newer-typescript-versions)-t. A never típust akkor használjuk, amikor a metódusunk vége unreachable. Ez nem egy gyakori példa, ezért vegyük át az eseteket:

Az egyik ilyen, mikor kivételt dobunk:

```
<pre data-language="javascript">function wontReturnEver() : never {
  throw new Error("Oops");
}
```

A másik eset a végtelen ciklus:

```
function wontReturnEver() : never {
 while(true) {
   // how cool is that?
 }
}
```

Rafkós a rendszer, mert nem lehet könnyen átverni:

[![Selection_030](assets/uploads/2016/09/Selection_030.png)](assets/uploads/2016/09/Selection_030.png)

A harmadik eset pedig amikor ezen metódusokat hívjuk és ezek visszatérési értékét adjuk vissza:

```
<pre data-language="javascript">function noShitSherlock() : never {
 return wontReturnEver();
}
```

Egyre "jobb" programozási gyakorlatokat láthatunk, nem? Azért nem kell feltétlenül végtelen ciklusokat használni, hogy szerepelhessen a kódunkban a never, oké? 🙂

A voidhoz hasonlóan akad még két másik típus, ami önmagában nem valami hasznos, az **undefined** és a **null**.

Alapesetben a null és az undefined altípusai az összes más típusnak, ennélfogva null-t vagy undefined-ot hozzárendelhetünk pl. egy stringhez vagy array-hez akár.

```
<pre data-language="javascript">let test : number[] = null;
let test2 : number[] = undefined;
```

Ez emlékeztethet minket az erősen típusos nyelveknél megszokottakra, ugye? Jó kis null checkek a metódusok elején, netán Optional osztályok. Később majd még lesz szó az ún. strictNullChecks flagről.

**Type cast**

A név kissé becsapós, mert itt semmi runtime ráhatása nem lesz a dolognak, csak a compiler fogja végezni a dolgot. Ezzel tudjuk elérni, hogy a TypeScriptre ráerőszakoljuk, hogy ez a változó bizony ez a típus. Na de nézzük a szintaktikáját a dolognak:

Vegyünk egy alapesetet, hogy meghákoljuk a polimorfizmust:

```
<pre data-language="javascript">export class Rucsok{
 public randomNumber : number;
}

let obj : Object = new Rucsok();
```

Ezután ha megpróbálunk valamit csinálni az obj változón, akkor bizony nem látunk semmit a Rucsok classból, pedig annak van egy publikus tagváltozója, ejnye!

[![Selection_033](assets/uploads/2016/09/Selection_033.png)](assets/uploads/2016/09/Selection_033.png)

Na akkor most vessük be a type assertion-t!

```
<pre data-language="javascript">let rnd : number = (obj as Rucsok).randomNumber; // ez az as kulcsszóval működő 

rnd = (<Rucsok>obj).randomNumber; // ez pedig a kifordított generikus módszer
```

Ismét kihangsúlyoznám, hogy ennek semmi runtime hatása nem lesz, a generált kódban:

```
<pre data-language="javascript">var rnd = obj.randomNumber;
rnd = obj.randomNumber;
```

nem szerepel majd a dolog, csak compile time segít.

#### Modulok

Sajna arra nincs elég hely itt, hogy végignyálazzuk a TypeScript összes újdonságát, ezért most fókuszáljunk inkább azokra a részekre, amik minden esetben előjönnek majd a vele való munka során. Az egyik ilyen a modulok kérdése lesz majd. Az ES2015-ben már vannak modulok, ezt pedig a TypeScript is hozza magával. Az egyik legfontosabb tudnivaló, hogy ezek a modulok saját scope-al rendelkeznek, ennélfogva nem fogják beszennyezni a globális scope-ot, kivéve ha exporttal kiexportáljuk azt és importtal pedig hivatkozunk rá. A többit kívülről nem érjük el, ellenben a kiexportált osztályban, stb. hozzáférünk a modul elemeire, amiből kihúztuk azt. Ezt fogjuk fel amolyan package private-nek (Java-sok szeme most felcsillan ).

> Exportot alkalmazhatunk bármilyen deklarációra, classra, aliasra, interfészre, változóra

Ez az import nem ugyanaz, mint amit a module loaderek végeznek. A module loaderek felelősek hogy runtime behúzzák a függőségeket mielőtt futtatják a kódot. Node.JS-ben ilyen a CommonJS és weben pedig a [require.js]({{ site.url }}/2015/12/30/javascript-pakk-3-kinek-kell-a-js/).

A TypeScript többféle module loaderhez képes kompatibilis kódot előállítani, így commonjs, amd, system, ES6, ES2015, umd-re. Na de mi is ez az egész?

Kicsit rendszerezzük a projektünket, hozzunk létre egy src mappát és egy dist mappát is. Előbbi fogja tartalmazni a ts, utóbbi a js fájlokat. A projektünk gyökerében pedig hozzunk létre egy tsconfig.json-t. Ez tartalmazza majd a konfigurációt ami szerint a compiler dolgozik majd.

A konfig fájl tartalma legyen a következő:

```
<pre data-language="javascript">{
 "include": [
 "src/**/*"
 ],
 "compilerOptions": {
 "outDir": "dist",
 "module": "amd"
 }
}
```

Itt beállítjuk, hogy a generált fájlokat a dist mappába fogja tenni, AMD szerint hozza létre őket és az src mappából rekurzívan minden fájlt behúz. Hozzunk létre az src mappában egy some-module.ts-t:

```
<pre data-language="javascript">import {AnotherModule} from "./another-module";

export class SomeModule {
 private property : AnotherModule;

 public constructor(dependency : AnotherModule) {
 this.property = dependency;
 }
}
```

Valamint az általa hivatkozott another-module.ts-t:

```
<pre data-language="javascript">export enum AnotherModule {
 NOTHING, HERE
}
```

Végül az őket használó main.ts-t:

```
<pre data-language="javascript">import {AnotherModule} from "./another-module";
import {SomeModule} from "./some-module";

var mod : SomeModule = new SomeModule(AnotherModule.NOTHING);
```

Ezután nézzük mit sikerült a rendszernek forgatnia belőle!

**some-module.js**

```
<pre data-language="javascript">define(["require", "exports"], function (require, exports) {
 "use strict";
 var SomeModule = (function () {
 function SomeModule(dependency) {
 this.property = dependency;
 }
 return SomeModule;
 }());
 exports.SomeModule = SomeModule;
});
```

Ebben a modulban ugyan függünk az another-module-tól, azonban itt mégsem jelenik meg, az mert nem használjuk azt direktben, ezért nincs szükség rá. Jól látható, hogy define blockokba csomagolta a tartalmat a compiler és a require/exports modulokat default beleinjektálja. Ez azért fontos, hogy más modulokat is be tudjunk húzni vagy épp a miénket exportálni.

**another-module.js**

```
<pre data-language="javascript">define(["require", "exports"], function (require, exports) {
 "use strict";
 (function (AnotherModule) {
 AnotherModule[AnotherModule["NOTHING"] = 0] = "NOTHING";
 AnotherModule[AnotherModule["HERE"] = 1] = "HERE";
 })(exports.AnotherModule || (exports.AnotherModule = {}));
 var AnotherModule = exports.AnotherModule;
});
```

Itt se jelenik meg semmilyen másik modul, lévén itt nem is használunk mást, csak kiexportáljuk az enumot amit deklaráltunk.

**main.js**

```
<pre data-language="javascript">define(["require", "exports", "./another-module", "./some-module"], function (require, exports, another_module_1, some_module_1) {
 "use strict";
 var mod = new some_module_1.SomeModule(another_module_1.AnotherModule.NOTHING);
});
```

Na itt már látszik, hogy valóban használjuk a két létrehozott modult. Aliasokat képez a compiler és azokat használva tudjuk behúzni őket. Na de miért kell még az aliason belül kulcsokat is képezni? Nos részben azért, mert egy ilyen modulból több elemet is kiexportálhatok és be is importálhatok több elemet. Az importok során a beimportálandó elem neve meg kell egyezzen a kiexportált elem nevével, DE! aliasokat alkalmazhatunk, ahogy azt más nyelveknél már megszoktuk. Tehát:

```
<pre data-language="javascript">import {SomeModule as some} from "./some-module";
import {AnotherModule as dep} from "./another-module";

let stuff : some = new some(dep.HERE);
```

Láthatjuk, hogy aliassal más néven tudjuk használni a beimportált elemeket, ha úgy tartja kedvünk.

Ha nem csak egy elemet akarunk, akkor a \*-al behúzhatjuk a modulban exportált összes deklarációtegy alias alá. Ilyenkor az alias alatti kulcsokkal férünk hozzá az egyes elemekhez:

```
<pre data-language="javascript">import * as some from "./some-module";
import * as dep from "./another-module";
let stuff : some.SomeModule = new some.SomeModule(dep.AnotherModule.HERE);
```

> **Na de mi a helyzet akkor, amikor egy third party libet használnék, ami sima JavaScript?**

Ahhoz, hogy ezeket használni tudjuk, a TypeScript számára le kell írjuk annak a szerkezetét, a publikus API-ját, amit használni akarunk. Szerencsénkre elég sok ismert libhez készültek már ilyen leírók, amit **.d.ts** kiterjesztésű fájlokban írunk le. Hasonlóan működnek, mint a C/C++-ból is ismert header fájlok. Az ilyen fájlokat "ambient" deklarációknak nevezzük, mert nem tartalmazzák az implementációt.

Nézzünk egy példát rá!

Node.js-ben a legtöbb funkció használatához be kell importálnunk az adott modult. Rengeteg ilyen van, ezért ahelyett, hogy mindnek létrehoznánk a saját kis leíróját, inkább egy nagyba gyúrjuk azt össze.

```
<pre data-language="javascript">declare module "url" {
 export interface Url {
 protocol?: string;
 hostname?: string;
 pathname?: string;
 } 
 export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url; 
} 
declare module "path" {
 export function normalize(p: string): string;
 export function join(...paths: any[]): string;
 export var sep: string; 
}
```

Ezt mentsük le egy **node.d.ts** fájlba. Természetesen ez csak egy töredéke a node.js API-jának, pusztán a példa kedvéért.

Ezután már tudunk rá hivatkozni az ún. triple slash használatával:

```
<pre data-language="javascript">/// <reference path="node.d.ts" />
import * as URL from "url";
<span class="hljs-keyword">let</span> myUrl = URL.parse(<span class="hljs-string">"http://www.typescriptlang.org"</span>);
```

A definition fájl behúzása után ugyanúgy működik, mint egy TypeScript fájl.

Szerencsénkre nagyon sok libhez már van kész definition fájl, így nem kell azt megírnunk magunknak. Többet erről [itt](https://github.com/DefinitelyTyped/DefinitelyTyped).

Órákon át lehetne pötyögni a TypeScriptről, de nem az a cél, csak egy kis betekintés, mielőtt beleugrunk az Angular 2-be TypeScript alapokon! Tehát egyelőre legyen elég ennyi, ha pedig bármi észrevétel van, a lenti komment szekció bárki rendelkezésére áll!