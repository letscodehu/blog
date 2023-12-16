---
id: 867
title: 'Javascript pakk No. 1 &#8211; ECMAScript 6'
date: '2015-12-24T11:30:05+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=867'
permalink: /2015/12/24/javascript-pakk-no-1-ecmascript-6/
dsq_thread_id:
    - '4430375511'
    - '4430375511'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2015/12/09201957/java4eveer-540x312-1.png'
categories:
    - Frontend
    - JavaScript
tags:
    - babel
    - ecmapscript
    - es5
    - es6
    - javascript
---

A frontend fejlesztők élete nem csak játék és mese. Nem elég hogy a javascript prototype object modelje sokakban a hányingerre kisértetiesen emlékeztető érzéseket kelt, mindezt megfejelik aszinkron funkcionalitással és callback hegyekkel, a dinamikus típusosságról nem is beszélve.

Persze a nyelv fejlesztői mindezzel tökéletesen tisztában vannak, ezért kifejlesztették egymás közt a csuklás legjobb gyógymódját, az ECMAScript 6-os szabványt!

Ez sok újdonságot hoz a nyelvbe, viszont a böngészők egy része még nem támogatja vagy nem teljesen, viszont van rá mód, hogy azok számára is emészthetővé tegyük. A későbbiekben erről is írok.

Menjünk hát végig, hogy miben változik a szabvány az eddigiekhez képest!

#### Konstansok

A nyelv eddig nem támogatta a konstansokat, vagyis olyan "változókat", amiknek nem lehet megváltoztatni a tartalmát a definiálást követően.

> Megjegyzés: A változó maga nem változhat, viszont az ahhoz rendelt tartalom igen. Tehát egy objectre mutató pointer ugyanarra az objectre fog mutatni, viszont az objektum maga változhat.

```
// ECMAScript 6
const PI = 3.141593
```

```
<pre data-language="javascript">// ES5-ben az object helperekkel lehetett megvalósítani
// és azt is csak global scope-ba
Object.defineProperty(typeof global === "object" ? global : window, "PI", { 
  value: 3.141593, 
  enumerable: true, 
  writable: false, 
  configurable: false 
});
```

#### Scope-ok

A nyelvben eddig nem volt lehetőség ún. block-scoped változók deklarálására. Két opció volt eddig, mikor globális változót hoztunk létre, sima értékadással:

```
<pre data-language="javascript">pi = 3.14; // globális, a definiálás helyétől függetlenül
```

A másik opció, mikor a var kulccsó használatával lokális változót hozunk létre.

```
<pre data-language="javascript">function scoping() {
   var teszt = 5; // a létrehozó function-ön belül elérhető
   console.log(teszt); // 5
}

function scoping2() {
   for (var x = 0; x < 10; x++) {
      var teszt2 = 36;
   }
   console.log(teszt2);  // 36 még itt is elérhető, hiszen a létrehozó function ugyanaz
}
console.log(teszt); // undefined
console.log(teszt2); // undefined
```

#### **Let** it be!

Na és akkor jöjjön az újdonság az ES6 oldalról. A let kulcsszó segítségével ún. block scoped változókat tudunk létrehozni, amik nem lesznek az egész tartalmazó function-ön belül elérhetőek (ahogy azt minden normális nyelvben is lehet):

```
<pre data-language="javascript">function teszt() {
   let teszt = 36
   for (var x = 0; x < 10; x++) {
      let teszt = 5; // csak az adott blokkon belül (jelen esetben a for ciklus) érhető el
   }
   console.log(teszt); // 36
}
```

Na most akkor ismét idézném a kedves orosz kollégát.. *How cool is that?[![java4eveer-540x312](assets/uploads/2015/12/java4eveer-540x312.png)](assets/uploads/2015/12/java4eveer-540x312.png)*

#### .NET betyárok, szevasztok!

Aki foglalkozott már valaha C#-al, az már bizonyára belefutott az ún. lambda kifejezésekbe. Hasonló (de működését tekintve más) szintax érkezett most az ES6-al. Akinek új: röviden egy egyszerűbb és átláthatóbb szintaxis a [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Closure)-ök létrehozására:

```
<pre data-language="javascript">// ES5 módi

valamilyen.metodus(function(x) { return x + 1; }); // ez eddig is ment, nincs ebben semmi új, igaz?
valamilyen.metodus(function(x,y) { return x + y;}); // ez se új
```

```
<pre data-language="javascript">// ES6
valamilyen.metodus(x => x + 1); // he? várjunk csak.. ez annyira nem bonyolult.. sőt, egész jó, nem?
// akkor most bonyolítsuk kicsit
valamilyen.metodus((x,y) => x + y); // hoppá, megy ez több paraméterrel is? Hol volt az az orosz idézet?
```

Nézzük meg mindezt pl egy forEach-nek átadott functionben!

```
<pre data-language="javascript">// (Good) Plain old ES5
tomb.forEach(function(v) {
     if (v % 5 === 0) {
         fives.push(v);
     }
}); 

// ES6 style
tomb.forEach(v => {
    if (v % 5 === 0) {
         fives.push(v);
    }
});
```

#### THIS, you are here!

Emlékeztek még arra, amikor javascriptben nem kellett újraassign-olni az aktuális objektumra mutató pointer (this) értékét egy lokális változóba, vagy éppen bindolni azt (ES 5.1 után) a meghívott függvényben? Nem? Én se. Viszont ezeknek az időknek vége! Mostantól a this, az ahogy nevéből is adódik. Ez lesz. Nem pedig valami más.

Maradjunk az előbbi forEach példánál:

```
<pre data-language="javascript">// ES5 style
var self = this;
this.nums.forEach(function(v) {
    if (v % 5 === 0) {
       self.fives.push(v);
    }
}) 

// ES5.1+ style

this.nums.forEach(function(v) {
    if (v % 5 === 0) {
       this.fives.push(v);
    }
}.bind(this)); // itt bekötjük a this context-et a functionbe
// ES6 style
this.nums.forEach(function(v) {
     if (v % 5 === 0) {
         this.fives.push(v); // se this újraassign-olás, se bind, csak gyönyörű haj!
     }
 });
```

#### Default parameter value

Akik PHP-vel foglalatoskodnak, azoknak nem lesz újdonság, hogy ún. alapértelmezett értékekkel adjuk át a függvényeinknek a paramétereket. Tehát ha az adott paraméter nem kerül átadásra, akkor is hozzárendel valami értéket. Persze jól szituált hákolással ez is megvalósítható volt eddig, nézzük hogy is zajlott mindez:

```
<pre data-language="javascript">function f (x, y, z) {
 if (y === undefined)
 y = 7;
 if (z === undefined)
 z = 42;
 return x + y + z;
};
f(1) === 50; // jóféle hákolás, mi?
```

Akkor nézzük meg mennyivel egyszerűsödik le az életünk most az ES6-al:

```
<pre data-language="javascript">function f (x, y = 7, z = 42) {
 return x + y + z
}
f(1) === 50
```

Hát komolyan, szóhoz se lehet jutni, már kezd olyan lenni az egész, mintha valami programnyelv lenne, nem? De a java még hátravan!

#### Rest parameter

A napfényes polimorfizmus egyik formája az ún. method overload. Sajnos ezen nyelvben erre nincs lehetőség olyan formában, mint pl. Javaban vagy C#-ben, viszont amit pluszban odapasszolunk a függvényünknek, azt be tudjuk csomagolni egy tömbbe:

```
<pre data-language="javascript">// ES5 módi
function f (x, y) {
 var a = Array.prototype.slice.call(arguments, 2); // fogjuk és levágjuk az első két elemét az átadott paraméterek alkotta tömbnek
 return (x + y) * a.length;
};
f(1, 2, "hello", true, 7) === 9;
```

Akkor nézzük mennyivel közelebb áll ez a világunkhoz az ES6:

```
<pre data-language="javascript">function f (x, y, ...a) { // a ...a jelenti az összes többi argumentumot tömbbé alakítva, amiket esetleg megkap a függvényünk
 return (x + y) * a.length
}
f(1, 2, "hello", true, 7) === 9
```

Ha már ennyire szétbontunk mindent tömbökre, akkor nézzük hol lehet még a spreading syntaxot használni?

```
<pre data-language="javascript">// ES5 style
var params = [ "hello", true, 7 ]; // alap tömbünk
var other = [ 1, 2 ].concat(params); // [ 1, 2, "hello", true, 7 ] // régen ezt csak concattal lehetett beleoktrojálni a másikba
f.apply(undefined, [ 1, 2 ].concat(params)) === 9; // az előző függvényünket használva kipróbáljuk azt
var str = "foo";
var chars = str.split(""); // [ "f", "o", "o" ] // stringet csak splittel tudunk az egyes karakterek alkotta tömbbé alakítani

// ES6
var params = [ "hello", true, 7 ]
var other = [ 1, 2, ...params ] // [ 1, 2, "hello", true, 7 ] // spreadelve adjuk át az elemeket, mintha concat lenne
f(1, 2, ...params) === 9
var str = "foo"
var chars = [ ...str ] // [ "f", "o", "o" ] spread a stringet is :O
```

#### Template literals (template strings)

PHP-ben már korábban is jelen volt (és egyes esetekben okozhatott meglepetéseket) a következő feature. Javascriptben eddig, ha változókat akartunk behelyettesíteni stringbe, akkor a string replace-el vagy épp egyesével összerakosgatva tudtuk megtenni azt. PHP-ben a ""-ök közötti stringekben elhelyezett változók értékét automatikusan behelyettesítette a rendszer, hasonló került most be az ES6-al, de nézzük az eddigi hákolásos megoldásokat:

```
<pre data-language="javascript">// ES5 : Based on a true story 
var customer = { name: "Foo" };
var card = { amount: 7, product: "Bar", unitprice: 42 };
message = "Hello " + customer.name + ",\n" + // a jó öreg összeollózott karakterliterál
"want to buy " + card.amount + " " + card.product + " for\n" +
"a total of " + (card.amount * card.unitprice) + " bucks?";
```

ES6-ban is jelölnünk kell, hogy a következő string bizony template, amibe változókat szeretnénk behelyettesíteni. Ehhez a szokásos " helyett ` karakterek közé kell azt tennünk, az alábbi módon:

```
<pre data-language="javascript">var customer = { name: "Foo" }
var card = { amount: 7, product: "Bar", unitprice: 42 }
message = `Hello ${customer.name},
want to buy ${card.amount} ${card.product} for
a total of ${card.amount * card.unitprice} bucks?` // és bumm, így lett az XSS!
```

#### OO újítások

Gondolom akárkit kérdeznék, aki foglalkozik más komolyabb objektumorientált paradigmákat alkalmazó nyelvvel, az nem igen szívleli a prototype object modeljét a javascriptnek. Körülményes, a szemnek idegen szavak és kód. Na, ennek vége!

Nézzük csak az osztálydefiníciót:

```
<pre data-language="javascript">// ES5 - From hell
var Shape = function (id, x, y) { // őő.. igen, ez egy konstruktor, a Shape meg egy osztály, fúj.
 this.id = id;
 this.move(x, y);
};
Shape.prototype.move = function (x, y) { // Ennek nem az osztálydefiníción belül kéne lennie? Meg miért kell a prototype, miért?
 this.x = x;
 this.y = y;
};
```

Akkor most vegyünk egy mély lélegzetet, számoljunk el tízig és nézzük meg a következőt:

```
<pre data-language="javascript">class Shape { // osztálydefiníció?
 constructor (id, x, y) { // konstruktor
 this.id = id
 this.move(x, y)
 }
 move (x, y) { // instance method? 
 this.x = x
 this.y = y
 }
} // és mindez JS? Bizony, nem szellemeket látsz!
```

#### Öröklődés

Ha ez nem lett volna elég, hogy instant nekiess a specifikációnak, akkor jöjjön a következő lépés. Mi a helyzet, ha öröklődést akarsz megvalósítani?

```
<pre data-language="javascript">// Kérem felkészülni, felkavaró ES5 öröklődés következik:
var Rectangle = function (id, x, y, width, height) { // still szép konstruktor
 Shape.call(this, id, x, y); // az a bizonyos "super"
 this.width = width;
 this.height = height;
};
Rectangle.prototype = Object.create(Shape.prototype); // átpasszoljuk a prototípust
Rectangle.prototype.constructor = Rectangle; // assignoljuk a konstruktort
var Circle = function (id, x, y, radius) { // megint egy "konstruktor"
 Shape.call(this, id, x, y); // super
 this.radius = radius;
};
Circle.prototype = Object.create(Shape.prototype); // és így tovább
Circle.prototype.constructor = Circle;
```

Akkor jöjjön mindez ES6-ban:

```
<pre data-language="javascript">class Rectangle extends Shape { // extends? :O
 constructor (id, x, y, width, height) { 
 super(id, x, y) // super??
 this.width = width
 this.height = height
 }
}
class Circle extends Shape {
 constructor (id, x, y, radius) {
 super(id, x, y) // ez nem csak konstruktorra működik, bizony.. base class elérés a super kulcsszóval.. F-yeah!
 this.radius = radius
 }
}
```

Kérem tegye fel a kezét, aki szerint ez utóbbi sokkal inkább OO-style!

#### Static members

Akár hiszitek, akár nem, ezzel még mindig nincs vége. Lassan kukát fejelek, ahogy írom, mert inkább JS-eznék (na jó, ez hazugság, inkább valami erősen típusos nyelv, de psszt! ):

```
<pre data-language="javascript">// ES5
var Rectangle = function (id, x, y, width, height) {
 // "konstruktor"
};
Rectangle.defaultRectangle = function () { // ez lenne a statikus metódus, jelen esetben egy factory method
 return new Rectangle("default", 0, 0, 100, 100);
};
var Circle = function (id, x, y, width, height) {
 …
};
Circle.defaultCircle = function () {
 return new Circle("default", 0, 0, 100);
};
var defRectangle = Rectangle.defaultRectangle();
var defCircle = Circle.defaultCircle();
```

Ezt mondjuk kitaláltuk volna, de nézzük már meg, hogy mi a változás, hé!

```
<pre data-language="javascript">class Rectangle extends Shape { 
 …
 static defaultRectangle () { // na ne.. tényleg képesek voltak beletenni végre egy static kulcsszót?
 return new Rectangle("default", 0, 0, 100, 100)
 }
}
class Circle extends Shape {
 …
 static defaultCircle () { // bizonyám!
 return new Circle("default", 0, 0, 100)
 }
}
var defRectangle = Rectangle.defaultRectangle()
var defCircle = Circle.defaultCircle()
```

#### [![settheworld](assets/uploads/2015/12/settheworld.jpg)](assets/uploads/2015/12/settheworld.jpg)

#### Set the world on fire!

Újabb adatszerkezetek érkeznek a nyelvbe, hogy a gyakran használt struktúrák helyét átvegyék és mindeközben frissebb-lágyabb-jobb érzéssel töltsenek el minden Coccolino macit. Ezek egyike lett a set ojjektum.

```
<pre data-language="javascript">// ES5 
var s = {}; // sima ojjektum
s["hello"] = true; s["goodbye"] = true; s["hello"] = true; // feltöltjük elemekkel, a hello lévén ismétlődik, felülcsapja az előzőt
Object.keys(s).length === 2; // 2 elem van benne
s["hello"] === true; // bizony, still true
for (var key in s) // arbitrary order
 if (s.hasOwnProperty(key)) // fincsi, mi?
 console.log(s[key]);

// ES6
let s = new Set() // hmm, Set ojjektum?
s.add("hello").add("goodbye").add("hello") // az add felülcsapja, ha már van ilyen kulcs
s.size === 2 // size property length helyett
s.has("hello") === true
for (let key of s.values()) // values-al szedjük ki a cuccot
 console.log(key)
```

[![maps](assets/uploads/2015/12/maps-1024x574.png)](assets/uploads/2015/12/maps.png)Ez gondolom még senkit sem vág a falhoz, szóval akkor jöjjön a következő... <del>Goole</del> Map<del>s</del>! Javascriptben, eddig ha ún. HashMap vagy PHP-s körökben asszociatív tömb kellett, akkor a nyelv ezt egy sima object kulcsaiban tárolta, ez szép és jó, csak semmiféle plusz, Mapre jellemző funkcionalitással nem bírtak a plain objecten felül:

```
<pre data-language="javascript">var m = {}; // sima object
m["hello"] = 42; // beleoktrojáljuk "kulcsként"
for (key in m) {
 if (m.hasOwnProperty(key)) { 
 var val = m[key]; 
 console.log(key + " = " + val); // majd a kulcs -> érték párokat kiszedjük belőle
 }
}
// ES6
let m = new Map() // Map ojjektum
m.set("hello", 42) // beletesszük a kulcsot
m.size === 1
for (let [ key, val ] of m.entries()) // az entries()-el tudjuk kinyerni a benne elhelyezett párokat
 console.log(key + " = " + val)
```

Fasza, ugye? Akkor jöjjön az amitől a Java fejlesztők elalélnak majd!

#### WeakSet / WeakMap

Ha valaki belefutott már egy autentikus memory leakbe, akkor annak nem kell mondanom mennyire kardinális kérdés ez. Amikor csak 1 lekérés erejéig él az alkalmazás, akkor még annyira nem kardinális a dolog, viszont ha hosszú időn át fut, akkor jön elő mennyire durva a helyzet. Frontendnél még annyira nem szoktak ilyenek előjönni, ahhoz nagyon nagy baklövés kell, de backenden egy kellően szarul megírt node tud finomságokat produkálni. Persze a rendszer nem úgy működik, mintha C-ben írnánk, azért tesz értünk és fut az a bizonyos GC, de ha referenciák beragadnak, akkor bizony az óhatatlanul ottmarad és csámcsog a heap tetején. Hogy megkönnyítsék az életünket, itt is megjelentek az ún. weak reference-ek, illetve azoknak két konkrét "megvalósítása". Ez esetünkben nem a konkrét Mapra és Setre, hanem a benne tárolt kulcsokra vonatkozik, tehát ha valahol az adott kulcson csücsülő ojjektum eredeti referenciáját kitakarítjuk, akkor nem marad benne ezekben az adatszerkezetekben. Lévén ilyet nem lehetett ES5-ben csinálni, ezért csak az ES6 példa jöjjön:

```
<pre data-language="javascript">let isMarked = new WeakSet() // az a bizonyos weak referenciákkal vértezett set
let attachedData = new WeakMap() // és map
export class Node { // csinálunk egy ojjektumot
 constructor (id) { this.id = id }
 mark () { isMarked.add(this) } // betesszük a set-be
 unmark () { isMarked.delete(this) } // kiszedjük a set-ből
 marked () { return isMarked.has(this) } // megnézzük, hogy a set-ben van-e az adott elem
 set data (data) { attachedData.set(this, data) } // betesszük a map-be
 get data () { return attachedData.get(this) } // és kikapjuk onnan
}
let foo = new Node("foo") // példányosítjuk az objektumot
JSON.stringify(foo) === '{"id":"foo"}'
foo.mark() // betesszük a set-be
foo.data = "bar" // a setteren keresztül betesszük a map-be
foo.data === "bar"
JSON.stringify(foo) === '{"id":"foo"}'
isMarked.has(foo) === true // megnézzük, hogy bent van-e a set-ben
attachedData.has(foo) === true // megnézzük, hogy az objektum bent van-e a mapben
foo = null /* kitakarítjuk a referenciát */
attachedData.has(foo) === false // hopp.. már nincs bent 
isMarked.has(foo) === false // a set-be se
```

Nos, remélem ez a kis adag kedvet hozott arra, hogy Ti magatok is beleássátok magatokat a specifikáció részleteibe vagy elkezdjétek próbálgatni. Persze még nem érdemes csak úgy ES6 kódot hányni, legalábbis kliensoldalon, lévén még a [kompatibilitás ](https://kangax.github.io/compat-table/es6/)hagy némi kívánnivalót maga után, viszont akadnak fordítók, amik ES5-öt varázsolnak belőle. Ilyen pl. a [babel](https://babeljs.io/), amiről majd szintén írok az ünnepek alatt!

Apropó ünnepek...

Minden kedves olvasómnak Boldog Karácsonyt és kellemes <del>húsvéti</del> ünnepeket kívánok!

[![pope-christmas-gays](assets/uploads/2015/12/pope-christmas-gays.jpg)](assets/uploads/2015/12/pope-christmas-gays.jpg)