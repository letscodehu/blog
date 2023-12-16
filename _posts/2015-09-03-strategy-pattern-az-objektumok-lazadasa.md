---
id: 749
title: 'Strategy pattern, az objektumok lázadása'
date: '2015-09-03T20:52:18+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=749'
permalink: /2015/09/03/strategy-pattern-az-objektumok-lazadasa/
dsq_thread_id:
    - '4094712698'
    - '4094712698'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2015/09/09201919/screen_03.jpg'
categories:
    - 'Design Pattern'
    - Egyéb
    - PHP
tags:
    - class
    - example
    - oop
    - pattern
    - php
    - renderer
    - strategy
    - view
---

Minden fejlesztő életében vannak nehéz napok, mikor <del>iOS push notificationt akar megvalósítani C#-al</del> úgy érzi, hogy az általa kreált objektum jónak jó, de mi lenne ha több mindenre lenne jó, anélkül, hogy rommápakolnánk mindenféle plusz metódusokkal? Mi lenne, ha igazából nem is új funkcionalitást akarunk belevinni, csupán a jelenlegi működést akarjuk megváltoztatni, akár futásidőben. Erre és a hasonló kérdésekre kaphatunk választ <del>a pszichológusunknál</del> az alábbi cikkben a strategy pattern által.  
[![screen_03](assets/uploads/2015/09/screen_03.jpg)](assets/uploads/2015/09/screen_03.jpg)

A strategy pattern a viselkedési minták közé tartozik és arra szolgál, hogy egy objektumot új működési mechanizmussal ruházzon fel kívülről, akár futásidőben. A lényege annyi, hogy lesz egy ún. context objektumunk, aminek működése az osztály aktuális stratégia objektumától függ, ugyanis a stratégia objektum fogja megváltoztatni a context objektum működését.

Tegyük fel, hogy összedobtunk egy betyárjó MVC keretrendszert, ami annyira nem MVC, mivel a view része még nincs kész. Az alkalmazásunk több mindent szeretnénk, hogy megjelenítsen. RSS Feedet, Json-t, HTML-t, valamint szeretnénk konzolba is beledobni a dolgainkat. Ezt megvalósíthatjuk úgy is, hogy többféle renderelő osztályt hozunk létre és mindig azt hívjuk meg, amelyik éppen kell, vagy stratégia által.

Ahhoz, hogy ezt megvalósíthassuk, elsőnek szükségünk lesz egy interfácséra.

```
<pre data-language="php">interface RenderinStrategyInterface {
    public function render(ViewModel $model); // az interfész egy metódust követel meg, ami paraméterként egy viewmodelt vár
}
```

Most, hogy az interfész megvan, nézzük csak meg mi is ez a ViewModel? Ez csupán a teljesség kedvéért és a példa miatt tettem bele, jelenleg csak a view-nak átadott változókat és a template nevét fogja tartalmazni:

```
<pre data-language="php">class ViewModel {
// csak a teljesség igénye miatt
    private $variables, $template;

    public function __construct(array $variables = array()) {
        $this->variables = $variables; // a kívánt változókat elhelyezzük az objektumban
    }

    public function setTemplate($template) {
        $this->template = $template;  // beleoktrojáljuk a template-et
    }

    public function getVariables() {
        return $this->variables; // visszaadjuk a változókat
    }

    public function getTemplate() {
        return $this->template; // visszaadjuk a templatet
    }
}
```

Amint láthatjuk csak setterek és getterek vannak benne. Példányosításkor megadhatjuk neki a változókat, amiket meg akarunk jeleníteni/használni a view-ban. Jöjjenek akkor maguk a stratégiák!

```
<pre data-language="php">class PhpRenderingStrategy implements RenderingStrategyInterface {
    public function render(ViewModel $model) {
        // ez nagyon buta példa, ilyet úgysem fogunk csinálni :D
        foreach ($model->getVariables() as $key => $value) {
            // a lokális scope-ban assignoljuk a változókat, így könnyen elérhetőek lesznek az include-olt template-ben
            $key = $value; // $array["valtozo"] --> $valtozo
        }
        include_once($model->getTemplate()); // simán include-oljuk a template-t
    }
}
```

A fenti lesz a PHP template fájlokért felelős stratégia. Viselkedését tekintve roppant egyszerű. Az átadott viewmodelből kinyeri a változókat, berántja őket az adott scope-ba, utána include-olja a template fájlt és azzal a lendülettel meg is jeleníti azt. A másik a JSON kimenetért felelős stratégia lesz:

```
<pre data-language="php">class JsonRenderingStrategy implements RenderingStrategyInterface {
    public function render(ViewModel $model) {
        echo json_encode($model->getVariables(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); // csak szimplán gyártunk egy json stringet a változókból és kiíratjuk
    }
}
```

> Figyelmeztetés: a fenti példák a teljesség igénye nélkül készültek, nem gyakorlatban felhasználhatóak, hiszen nincs bennük szó header-ökről és még sok másról sem. Nem szoktunk kiíratni itt semmiféle kimenetet, ezt általában egy Response osztály végzi a send() metódusára, de ez már csak szájvíz kérdése.

A fenti JSON stratégia még egyszerűbb, hiszen csupán átengedi a viewmodelben található tömböt egy json\_encode-on és kiíratja annak tartalmát. Az alábbi pedig a fent contextként említett ViewRenderer class lesz, aminek átadjuk a stratégiát (amit egyébként megoldhatunk, hogy viewmodel alapján ő maga kiválasszon) és a viewmodelt. A render metódust pedig szimplán továbbforwardoljuk az irányába. Ennek a renderer osztálynak nem kell tudnia az egyes megjelenítésekhez tartozó logikát, stb. ezt a stratégiák felé kiszerveztük.[![greeble-corona-2m-comp](assets/uploads/2015/09/greeble-corona-2m-comp-1024x576.jpg)](assets/uploads/2015/09/greeble-corona-2m-comp.jpg)

```
<pre data-language="php">class ViewRenderer {

    private $strategy;

    public function __construct(RenderinStrategyInterface $strategy, ViewModel $viewModel) { // typehinteltük az interfészt, valamint a viewmodelt
        $this->strategy = $strategy; // a stratégiánk
        $this->viewModel = $viewModel; // ez a viewmodel hordozza magában a változókat
    }

    public function render() {
        $this->strategy->render($this->viewModel); // átadjuk a stratégia render függvényének a viewmodelt
    }

}
```

Jöjjön akkor a fent említett template fájl tartalma:

```
<pre data-language="php"><html lang="hu">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $title; ?></title>
</head>
<body>
<?php echo $name; ?>
<?php echo $email; ?>
</body>
</html>
```

Na és akkor nézzük az összhatást:

```
<pre data-language="php">$view = new ViewModel(
     array(
     'title' => 'Strategy pattern, az objektumok lázadása', 
     'name' => 'Tacsiazuma',
     'email' => 'noreply@letscode.hu'
     )
);
$view->setTemplate("template.phtml");

$phprenderer = new ViewRenderer(new PhpRenderingStrategy(), $view);
$phprenderer->render(); // a template.phtml tartalma a belyettesített értékekkel

$jsonrenderer = new ViewRenderer(new JsonRenderingStrategy(),$view); // itt használhatnánk akár ugyanazt a renderert is, csupán egy setStrategy setterre lenne szükségünk, hogy dinamikusan váltogassuk a stratégiákat.
$jsonrenderer->render(); // a json tartalma
```

A fenti példában példányosítunk egy viewmodelt, aminek paraméterként átadunk egy tömböt, valamint beállítjuk a template fájlt, amit használni akarunk. Ezután példányosítunk egy ViewRenderert és átadjuk neki a stratégiát, meg a viewmodelt és meghívjuk rajta a render metódust. A viewrenderer ekkor átadja a viewmodelt a stratégiának, ami megjeleníti az alapján a kimenetet a saját szájíze szerint.  
Mint láthattuk ez sem egy bonyolult minta, ami arra jó, hogy a különböző megvalósításokat elkülönítsük és ahelyett, hogy a logikát egy osztályba szerveznénk, kihelyezzük más-más osztályokba.

> **Update:** Facebookon történt visszajelzés arról, hogy miért is jobb ez a strategy pattern, mint pl. egy AbstractViewModel-t leörökíteni és a különböző megvalósításokat ott megoldani, aztán szimplán ezen meghívni a render-t. A problémám ezzel a megoldással az, hogy megtöri az ún. single responsibility irányelvünket. A viewmodel esetünkben semmi másra nem szolgál, mint adatokat hordoz. Képzeljük el az alábbi példát:  
> Jön egy ügyfél (Client), aki előáll egy specifikációval (ViewModel) és megkéri a webfejlesztő céget/menedzsert, stb. (ViewRenderer), hogy készítse el az alapján a weblapot. A cég nem fog nekiállni kódolni, hanem megkeresi az erre a célra alkalmas (RenderingStrategyInterface-t implementáló) fejlesztőt (konkrét Strategy), átadja neki a specifikációt és megkéri, hogy oldja meg. Tehát mindenki azt teszi, amire hivatott. A specifikáció nem fogja elkészíteni önmagát, a cég nem alkalmas fejlesztésre, a fejlesztő nem tudja fejből a specifikációt, a menedzser<del> elteszi a nagy lóvét</del> csak annyit tud a projektről, hogy kész van, de az már nem érdekli, hogy milyen patterneket, library-kat használtál benne, stb.

</body></html>