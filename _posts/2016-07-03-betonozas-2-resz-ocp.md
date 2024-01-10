---
id: 1157
title: 'Betonozás 2. rész &#8211; OCP'
date: '2016-07-03T14:09:51+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1157'
permalink: /2016/07/03/betonozas-2-resz-ocp/
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
image: 'assets/uploads/2016/07/09202134/download.jpg'
categories:
    - Architecture
tags:
    - clean
    - closed
    - code
    - design
    - open
    - principle
    - solid
---

Az előző cikkben elkezdtük tárgyalni a SOLID elveket. Az SRP-t ki is végeztük, így jöjjön a SOLID második pillére az OCP, azaz az open-closed principle, ami annyit tesz, hogy "open for extension, closed for modification", tehát a cél az lenne, hogy úgy tudjuk bővíteni az adott kódrészt (modul, osztály, csomag), hogy nem kell<del> reflectionnel szétgányolnunk az egészet</del> belenyúlnunk a forrásába.

[![surgery in a operating room.](assets/uploads/2016/07/download.jpg)](assets/uploads/2016/07/download.jpg)

Egy osztály zárt, mivel lefordul, valami libben elhelyeztük azt és kliens osztályok tudják használni. Ellenben egyszerre nyílt is, mert akármelyik osztály használhatja azt szülőosztályaként, új funkciókat hozzáadva. Amikor egy ilyen leszármazott osztályt definiálunk, nincs szükség arra, hogy az eredeti kódban módosítani kelljen bármit is.

Akkor nézzünk erre egy jó példát és aztán nézzünk egy olyat, ami autentikusan megsérti ezt a szabályt.

Egy roppant egyszerű és nehezen elrontható példa a Command pattern lesz:

```
interface SolrCommand {

    public void execute(SolrConnection $connection);
}
```

Az implementációja pedig:

```
class PingCommand {

    public void execute(SolrConnection $connection) {
         return $connection->get("/admin/ping");
    }
}
```

Ez egy elég gyenge példa, mert egy interfész esetében nem nehéz úgy megírni, hogy ne kelljen belenyúlni a bővítés érdekében 🙂 De jól látható a lényeg. Megírtuk az alap commandot, aminek a megvalósításával lehet bővíteni azt és új funkcionalitással ellátni azt.

De akkor nézzük hogy is lehet olyat írni, amire a fentiek nem igazak:

```
final class WontExtend {
     
}
```

Na jó, ez kb. csalásnak is betudható, hiszen, ha szándékosan finalként deklarálunk egy osztályt, azt valószínűleg okkal tettük, hogy senki ne is bővítse azt. Persze még itt is van lehetőség egy decoratorral bővíteni mindezt. Ugyanez igaz akkor, ha az osztályunkban kulcsfontosságú metódusok finalnek vannak deklarálva.

```
class Shape { // miért nem interfész? bár maximum marker interfész lehetne
    const CIRCLE = 1;
    const RECTANGLE = 2;
}

class Circle extends Shape {
    public $type = Shape::CIRCLE; // publikus változók igényesen
}

class Rectangle extends Shape {
    public $type = Shape::RECTANGLE;
}

class ShapeDrawer {
    public function drawShape(Shape $shape) { // még lehetne esetleg final is, hogy biztos szidjuk valaki felmenőit
          if ($shape->type == Shape::CIRCLE) {
              $this->drawCircle($shape);   
          } else {
              $this->drawRectangle($shape);
          }
    }
    private function drawCircle(Circle $circle) {...}
    private function drawRectangle(Rectangle $rectangle) {...}
}

```

Hát ez csodaszép, nem? Na, akkor nézzük mi is fogja kiütni a biztosítékot, ha valaki megkapja tőlünk a fenti kódrészletet. Tegyük fel, hogy az illető szeretne hozzáadni egy új formát, pl. háromszöget. Létrehozza az osztályt, átadja jóhiszeműen a shapedrawernek.. és nem történik <del>l\*fasz se</del> semmi.

Mi a fene? - kérdezi majd magában, hiszen hibát nem dob, mert frankón leextendelte a Shape osztályt, tehát a typehintbe befér, de az elágazásban nem fut be és még hibát sem dob. Ha a célunk az lenne, hogy csak az általunk megadott osztályokkal működjön, akkor illene valami exceptiont dobni egyéb esetben. Itt ilyen nem történik és az illető nagyon akaratos, nyom az IDE-ben egy 'Go to definition'-t és.. megáll az idő, az univerzum befogja a fülét, nehogy hallja a káromkodást.

Ahhoz, hogy az illető használni tudja a fenti osztályt, vagy le kell extendelni azt és overrideolni a fenti metódust, vagy egy decoratorba csomagolni és megírni a saját alakzatjaira a logikát, vagy felcsapni a gányerkipát és beleírni a mi általunk írt class-ba, hogy utána a composer update sírjon, hogy "itt biza valaki belehákolt az egyik csomagba, lelőjem?". Minden egyes új alakzat felvételekor ez előjön, meg kell írni az egyedi draw metódust és hozzá kell írni egy ágat az elágazáshoz, valamint nem árt az osztály konstansai közé is felvenni az új elemet.

A fenti probléma miatt találták ki a [strategy pattern]({{ site.url }}/2015/09/03/strategy-pattern-az-objektumok-lazadasa/)-t, hogy a megvalósítás logikáját kiemeljük innen és új és új osztályok létrehozásával, az eredeti osztályt érintetlenül hagyva tudjuk bővíteni azt. Ebben az esetben a shapedrawer valahogy így nézne ki:

```
interface ShapeDrawingStrategy {
       public void draw(Shape $shape);
}

class CircleDrawingStrategy {
       public void draw(Shape $shape) {
          // kör
       }
}

class RectangleDrawingStrategy {
      // ...
}

// na és akkor jöjjön a srác, aki beszopta a kódunkkal
class TriangleDrawingStrategy { 
     // ...
}

class ShapeDrawer {
    public function drawShape(ShapeDrawingStrategy $strategy, Shape $shape) {
          $strategy->draw($shape);
    }
}
```

Persze van aki már egyből a Shape interfészben helyezné el a draw metódust, ez igazából csak annak kérdése, hogy a Shape implementációink mi célt szolgálnak? Ha simán value object-ek, akkor nem illik oda a lerajzolásuk logikája. Ha a céljuk simán a kirajzolás, akkor azzal is meg lehet oldani és akkor egy

```
$shape->draw();
```

hívással váltjuk ki a fentit.

Na és jöjjön egy igen fontos megjegyzés az OCP-ről. A jó objektumorientált design tartalmazza azt, de nem minden esetben kell alkalmazni, mert olykor plusz köröket vinnénk a fejlesztésbe vele. Ott alkalmazzuk, ahol:

- runtime szeretnénk különböző implementációkat használni
- szeretnénk más fejlesztők számára lehetővé tenni, hogy új funkcionalitással bővítsék azt

Tehát amikor a kódunkat írjuk, akkor tartsuk észben az OCP-t, de ne úgy tekintsünk rá, mint egy törvényre,<del> amiért a saját életünkkel felelünk egy kód review során,</del> hanem ahogy a neve is mutatja, egy elv, amit a megfelelő szituációkban alkalmaznunk kell.
