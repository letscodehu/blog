---
id: 1163
title: 'Betonozás 3.0 &#8211; Liskov és a haverok'
date: '2016-07-05T19:01:51+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1163'
permalink: /2016/07/05/betonozas-3-0-liskov-es-haverok/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/07/09202136/liskov.jpg'
categories:
    - 'Design Pattern'
tags:
    - code
    - design
    - liskov
    - quality
    - solid
    - substition
---

> Kódolni pofonegyszerű.

Legalábbis a facebook hirdetéseink alapján ma már mindenféle tudás nélkül bármit össze lehet kattintgatni és még lehet külsőre jól is néz ki.

Ellenben ha minőségi munkáról van szó, akkor bizony közel sem olyan egyszerű a dolog. Ha húsz év múlva mi, programozók "uraljuk" majd a világot és ha véletlenül okozunk valami gebaszt, ami komoly károkat okoz, akkor biza a sarkunkra lépnek. A gond az, hogy a történelem jelen állása szerint akkor nem tudunk semmit felhozni majd a védelmünkre.

> Miért nem?

Ugyanis szinte minden szakmában vannak bizonyos szabályok, amiket betartanak. Szabályozva vannak, normák szerint dolgoznak. Ellenben ha belegondolok, hogy is nézett ki az első pár kódsor, amiért pénzt mertem kérni, nos az egy szabálynak felelt meg:

- <del>matchelt rá a .\* regexp</del> karakterekből állt.

Viszont szükségünk van szabályokra, hogyha egyszer odaáll elénk a főnőkünk, akkor tudjuk azt mondani, hogy én betartottam a szabályokat, <del>minden másra ott a 'not my fault!'</del>, a tesztek lefutottak, tehát minden tőlem telhetőt megtettem a minőség érdekében. Ha egyszerre többen dolgoznak egy projekten szintén kellenek a szabályok, mert hiába a compiler, ritka ronda dolgok másznak ki a kezünk alól, ha eluralkodik az irodában a káosz (itt most egy perc néma megemlékezés azokért, akik mind a mai napig verziókövetés nélkül dolgoznak csapatban ).

Ezen szabályok egyik gyűjteménye az ún. [SOLID]({{ site.url }}/2016/06/27/a-szilard-alapok/) irányelvek, aminek a harmadik betűjét fogjuk most megvizsgálni, az LSP-t (Liskov's substition principle)<del> magyarul.. inkább nem írom le.</del>

[  
![liskov](assets/uploads/2016/07/liskov.jpg)](assets/uploads/2016/07/liskov.jpg)

Az [előző]({{ site.url }}/2016/07/03/betonozas-2-resz-ocp/) cikkben kitárgyaltuk, hogy az osztályainkat úgy kell tudni bővíteni, hogy azok forráskódja érintetlen marad. Ha akarunk egy új funkcionalitást, akkor leörökítjük a szükséges osztályokat és nem kell újrafordítani azt a 100 megás jar fájlt, hogy beleírjak egy új elágazást egy if-else-be. Azonban van, hogy ez kevés.

A liskov féle elv kimondja, hogy a leörökített osztályainkat behelyettesíthetjük az ősosztály helyére, <del>mindenféle hekkelés nélkül</del>.

> Hát de ez mindig igaz a kódunkra, nem?

Sajnos nem minden esetben, főleg ha az objektumstruktúránkat rosszul terveztük meg. Nézzünk egy jóféle violationt a témában, amikor azt hinnénk, hogy az adott objektumhierarchia, lévén az életből átemelt, fasza lesz, de a végén rájövünk, hogy mégsem.

```
class Rectangle {
    protected $width, $height;

    public function setWidth($width) {
          $this->width = $width;
    }
    public function setHeight($height) {
          $this->height = $height;
    }

    public function getArea() {
           return $this->width * $this->height;
    }

}
```

Tipikus példa erre, téglalap. Ugye ha emlékszünk a geometria órákra, akkor tudjuk, hogy a négyzet, az egy speciális téglalap lesz, aminek ugye mindkét oldala egyenlő. Ha ebből indulunk ki, hogy a négyzet, **az egy** téglalap, akkor jön egyből, hogy az lesz az ősosztályunk.

```
class Square extends Rectangle {
    public function setWidth($width) {
          $this->width = $width;
          $this->height = $width;
    }
    public function setHeight($height) {
          $this->height = $height;
          $this->width = $height;
    }
}
```

Ez itt logikusnak tűnik, ugye? Ha a négyzeten beállítjuk a magasságot, vagy a szélességet, az magával vonzza a másik attribútum beállítását is. Tök jó, azonban van egy kis gond. Írjunk egy tesztet a Rectangle-re:

```
class RectangleTest extends TestCase {
   
   /** @test */
   public function it_returns_the_area() {
       $rekt = new Rectangle();
       $rekt->setWidth(5);
       $rekt->setHeight(10);
       $this->assertEquals(50, $rekt->getArea());
   }
}
```

A tesztünk pofonegyszerű, példányosítjuk az osztályt, beállítjuk a magasságot, a szélességet és a kettő szorzatát várjuk vissza. Bumm, a kapott érték 50, a teszt zöld. Na most cseréljük ki Square-re az implementációt. Hoppá, a teszt elhasalt mert 100-at adott vissza. Mi a gond?

A gond az, hogy a Square úgy módosítja a Rectangle működését, hogy az visszafelé nem lesz kompatibilis, lévén a setHeight a width értékét is felülcsapja. Persze ha tudjuk, hogy ott egy square jön, akkor a kliens igazodhat hozzá, de ezt miért is tudnánk, lévén nem mi fogjuk azt példányosítani, hanem a DI. Nézzük az alábbi példakódot a kliensünknek:

```
public function doStgWithRectangles(Rectangle $rekt) {
   $rekt->setWidth(5);
   ...
}
```

A fenti példában paraméterként kapjuk a Rectangle osztályt vagy annak leszármazottait, legalábbis a typehint ezt engedi.

Viszont mi itt max egy instanceof-al tudjuk eldönteni, hogy épp mit is kaptunk, de ez már a hack kategória.

De mi is a megoldás a fenti problémára? Nos, alapvetően más osztályhierarchiát kell létrehozni, mégpedig úgy, hogy a leszármazott osztályok ne változtassák meg az ősosztály működését. Ha megfigyeljük, akkor észrevehetjük, hogy az LSP az csak az open-closed principle kibővítése.
