---
id: 2005
title: 'Hacklang: a PHP jövője?'
date: '2016-12-20T12:17:43+01:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1976'
permalink: /2016/12/20/hacklang-a-php-jovoje/
dublin_core_author:
    - 'Enter author here'
dublin_core_title:
    - 'Enter title here'
dublin_core_publisher:
    - 'Enter publisher here'
dublin_core_rights:
    - 'Enter rights here'
pyre_show_first_featured_image:
    - 'yes'
pyre_portfolio_width_100:
    - default
pyre_video:
    - ''
pyre_fimg_width:
    - ''
pyre_fimg_height:
    - ''
pyre_image_rollover_icons:
    - default
pyre_link_icon_url:
    - ''
pyre_post_links_target:
    - 'no'
pyre_related_posts:
    - default
pyre_share_box:
    - default
pyre_post_pagination:
    - default
pyre_author_info:
    - default
pyre_post_meta:
    - default
pyre_post_comments:
    - default
pyre_main_top_padding:
    - ''
pyre_main_bottom_padding:
    - ''
pyre_hundredp_padding:
    - ''
pyre_slider_position:
    - default
pyre_slider_type:
    - 'no'
pyre_slider:
    - '0'
pyre_wooslider:
    - '0'
pyre_revslider:
    - '0'
pyre_elasticslider:
    - '0'
pyre_fallback:
    - ''
pyre_avada_rev_styles:
    - default
pyre_display_header:
    - 'yes'
pyre_header_100_width:
    - default
pyre_header_bg:
    - ''
pyre_header_bg_color:
    - ''
pyre_header_bg_opacity:
    - ''
pyre_header_bg_full:
    - 'no'
pyre_header_bg_repeat:
    - repeat
pyre_displayed_menu:
    - default
pyre_display_footer:
    - default
pyre_display_copyright:
    - default
pyre_footer_100_width:
    - default
pyre_sidebar_position:
    - default
pyre_sidebar_bg_color:
    - ''
pyre_page_bg_layout:
    - default
pyre_page_bg:
    - ''
pyre_page_bg_color:
    - ''
pyre_page_bg_full:
    - 'no'
pyre_page_bg_repeat:
    - repeat
pyre_wide_page_bg:
    - ''
pyre_wide_page_bg_color:
    - ''
pyre_wide_page_bg_full:
    - 'no'
pyre_wide_page_bg_repeat:
    - repeat
pyre_page_title:
    - default
pyre_page_title_text:
    - default
pyre_page_title_text_alignment:
    - default
pyre_page_title_100_width:
    - default
pyre_page_title_custom_text:
    - ''
pyre_page_title_text_size:
    - ''
pyre_page_title_custom_subheader:
    - ''
pyre_page_title_custom_subheader_text_size:
    - ''
pyre_page_title_font_color:
    - ''
pyre_page_title_height:
    - ''
pyre_page_title_mobile_height:
    - ''
pyre_page_title_bar_bg:
    - ''
pyre_page_title_bar_bg_retina:
    - ''
pyre_page_title_bar_bg_color:
    - ''
pyre_page_title_bar_borders_color:
    - ''
pyre_page_title_bar_bg_full:
    - default
pyre_page_title_bg_parallax:
    - default
pyre_page_title_breadcrumbs_search_bar:
    - default
fusion_builder_status:
    - inactive
refaktor_post_views_count:
    - '4622'
avada_post_views_count:
    - '4622'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
categories:
    - Fejlesztés
---

Aki dolgozott már velem az tudja, hogy szeretem a PHP-t. [Rengeteg olyan előnye van](https://slack.engineering/taking-php-seriously-cf7a60065329#.199ik52uv), amit más nyelvekben egyáltalán nem lehet megtalálni. Emellett viszont van jónéhány hülyesége is, amitől minden jóérzésű programozó tappancsokat növeszt és falra mászik. Éppen ezért jó ideje figyelem a [Hacklanget](http://hacklang.org/), a Facebook PHP „forkját”.  
  
Az egész Hacklang történet onnan indult, hogy a Facebookos fejlesztők gondoltak egyet és újra implementálták a PHP-t. Na nem azért, mert olyan sok fölösleges szabadidejük volt, hanem azért mert a PHP akkoriban egyszerűen túl lassú volt az igényeiknek. Ez a futtatómotor a [HHVM](https://docs.hhvm.com/hhvm/), vagyis a HipHop Virtual Machine. Régen akár négyszeres előnnyel bírt a szabvány PHP motorral szemben, de ez a PHP 7 megjelenésével csak néhány százalékra csökkent.

Ahogy azonban a HHVM fejlődött, jött vele egy másik technológia is: a Hacklang. Ez egy olyan programnyelv, ami szerkezetileg azonos a PHP-val, ám rengeteg PHP-s baromságot javítottak benne. Olyannyira kompatibilis az ősével, hogy egy eszköz segítségével oda-vissza lehet konvertálni a kódot a két nyelv között.

A hacklanget már csak azért is érdemes egy kicsit közelebbről megnézni, mert a PHP core fejlesztők egyértelműen inspirációt vesznek az új funkciók terén a Hackből. Nézzük hát.

## Az alapok

Mint írtam, a Hack szerkezetileg azonos a PHP-val, tehát ugyanúgy lesznek benne .php fájlok és rendelkezésre állnak ugyanazok a függvények, osztályok. A leglényegesebb különbség az, hogy a Hack fájlok nem a `<?php` karaktersorozattal, hanem `<?hh`-val kezdődnek. Ez jelzi a HHVM fordítónak, hogy itt Hacklang funkciókra is számítani kell, de egyébként akár klasszikus PHP kód is jöhet. Sőt mi több, Hacklang fájlokból közvetlenül hívhatunk PHP-s kódot is, így a megszoktott függvény-könyvtárak rendelkezésre állnak.

Arra érdemes figyelni, hogy a Hacklang a fejlesztők szándéka szerint egy szigorúan típusos nyelv, azaz akkor jár a legtöbb előnnyel a használata, ha minden tagváltozónak és visszatérési értéknek megadjuk a típusát. Ha ezt megtesszük, a típusellenörző már fordítási időben kidobja az ezzel kapcsolatos hibákat. Ez egy olyan funkció, ami a PHP-ból fájóan hiányik.

A Hacklang fejléc után jelezhetjük a fordítónak azt, hogy [milyen módban kívánjuk futtatni a kódot](https://docs.hhvm.com/hack/typechecker/modes):

<dl><dt>`<?hh`</dt><dd>Partial mód. Ha megadunk típusokat, a típusellenörző ezeket ellenőrzi, de a típus nélküli változókra nem panaszkodik.</dd><dt>`<?hh // strict`</dt><dd>Szigorú mód. Ebben minden változónak meg kell adnunk a típusát, az összehasonlítás szigorúan típusosan működik (hasonlóan a PHP `declare(strict_types=1)` módjához) és nem hívhatunk közvetlenül PHP kódot. Ezen felül csak osztályokban és függvényekben írhatunk kódot.</dd><dt>`<?hh // decl`</dt><dd>Ebben a módban nem fut a típusellenőrzé, de a fordító fájlban található típus-információkat felhasználja más fájlok ellenőrzéséhez. Ez akkor hasznos, ha meglevő PHP kódot konvertálunk.</dd></dl>Ezzel már készen is állunk a Hack programunk írására. Na de mik is azok a funkciók, amik rendelkezésünkre állnak? A teljesség igénye nélkül nézzünk meg néhányat:

## Szigorú típusosság

Hacklangben minden nem helyi változónak megadhatjuk a típusát, a függvényeknek pedig a visszatérési értékét:

```
class FormalEmailValidator {
    private <ins>bool</ins> $allowEmpty;

    public function __construct(<ins>bool</ins> $allowEmpty) {
        $this->allowEmpty = $allowEmpty;
    }

    public function getAllowEmpty() <ins>: bool</ins> {
        return $this->allowEmpty;
    }
}
```

Visszatérési értékeket természetesen a PHP 7-ben is tudunk megadni, de PHP-ban a hibás visszatérési értékből adódó hibákat csak futási időben kapjuk meg, amíg Hacklangben a HHVM rögtön fordításkor fog hisztizni, ezzel megkímélve minket némi anyázástól.

## Konstruktor inicializálás

Ha már a fenti kódot nézzük, kit nem idegesít a privát tagváltozók incializálgatása a konstruktorban? Rövidítsük le a fenti kódot egy másik szép Hack feature-el:

```
class FormalEmailValidator {
    <del>private $allowEmpty;</del> // erre mar nincs szukseg

    public function __construct(<ins>private</ins> bool $allowEmpty) {
        <del>$this->allowEmpty = $allowEmpty;</del> // erre mar nincs szukseg
    }

    public function getAllowEmpty() : bool {
        return $this->allowEmpty;
    }
}
```

Igen, ez pontosan azt csinálja amit gondolsz. Létrehoz a konstruktorból egy privát tagváltozót, amit rögtön inicializál is a konstruktor paraméter alapján.

## Normális string kezelés

Az egyik nagy bánatom a PHP-val az, hogy a stringek kezelése nem egységes. Tegyük fel, hogy van egy ilyen függvényem:

```
function printInvalidInputError($input) {
    echo('Invalid input: ' . (string)$input);
}
```

Igen, tudom, hihetetlenül bugyuta példa. De koncentráljuk a lényegre: a kapott változót átalakítjuk stringre.

Ez PHP-ban akkor fog működni, ha a változó a `bool, int, float, string` típusok egyike, vagy pedig egy olyan osztály példánya, amely rendelkezik egy `__toString()` metódussal. Ha ez egy olyan osztály, amely nem rendelkezik a \_\_toString() metódussal, gyönyörű szép futási idejű hibát kapunk. Azaz gyakorlatilag ilyen kódot kell írni:

```
function printInvalidInputError($input) {
    if (
        is_int($input) ||
        is_float($input) ||
        is_string($input) ||
        is_bool($input) ||
        (
            is_object($input) &&
            method_exists($input, '__toString')
        )
    ) {
        echo('Invalid input: ' . (string)$input);
    }
}
```

És még megy a csodálkozás, hogy egyesek miért utálják a PHP-t. Na de Hacklangben erre (nagyrészt) van megoldás:

```
function printInvalidInputError(\Stringish $input) {
    echo('Invalid input: ' . (string)$input);
}
```

Igen, pontosan ennyi. Megmondjuk, hogy mi egy string-szerű izét várunk és a fordító majd kisakkozza hogy azt kapunk-e.

## Normális tömb kezelés

A másik nagy szomorűságom a PHP-val a tömbök kezelése. Az, hogy a PHP keveri a hashmap és a tömb fogalmát még elnézhető lenne, de amit az objektum-orientált tömbök kezelésével csináltak...

Szóval PHP-ban van az `array` típus, ami egy natív tömb, kb így:

```
$foo = [
  'foo',
  'bar',
  1,
  2,
  3
];
```

Igen, pont annyira bonyolult mint amennyire kinéz: semennyire. Na ezen tömb kezelésére a PHP rendelkezésre bocsájt [egy hadseregnyi függvényt](http://php.net/manual/en/ref.array.php), például `sort`, `array_walk` vagy `array_udiff`.

Ezen felül a PHP-ban léteznek bizonyos interface-ek, például az [ArrayAccess](http://php.net/manual/en/class.arrayaccess.php), amivel felruházhatjuk az osztályunkat *tömbszerű* viselkedéssel.

Vagyis ez egy működő példa:

```
$blogPosts = new BlogPostList();
$blogPosts[] = new BlogPost();
```

Ez azért hasznos, mert `BlogPostList` osztályunkat a tömb elérésen kívül felruházhatjuk mindenféle függvénnyel, például hogy adja vissza azokat a blogpostokat amik egy kategóriába tartoznak, stb.

Na most, szerinted az ilyen tömb interface-ekkel megszentelt osztályokat át lehet adni tömbfüggvényeknek PHP-ban? Hát persze hogy nem. Miért is lenne kompatibilis.

Mondanom sem kell, hogy Hacklangben ezt megoldották:

```
<?hh

function test(\Indexish $a) : void {
  var_dump($a);
}

test([]);
```

## Normális tömb kezelés 2

Tegyük fel, hogy van a PHP kódunkban egy ilyen kis részlet:

```
/**
 * @param BlogPost[] $blogPosts
 */
function renderRSS(array $blogPosts) {
    //...
}
```

Persze, a kommentben megadtuk hogy mi ott egy BlogPostokkal feltöltött tömböt várunk, úgyhogy a PHPStorm erre fog kódkiegészítést adni, na de ezt senki nem garantálja nekünk. Simán lehet, hogy egy szeméttel teli tömböt kapunk aztán majd jól kimazsolázhatjuk a hibaüzenetekből, hogy mi történt.

Ezen a ponton nem meglepő, hogy van megoldás a Hacklangben:

```
function renderRSS(array<BlogPost> $blogPosts) {
    //...
}
```

Sőt mi több, a kulcsok típusát is meg lehet adni:

```
function renderRSS(array<string, BlogPost> $blogPosts) {
    //...
}
```

## Genericek

Hányszor, de hányszor előfordult már velem, hogy különböző származtatott osztályokat gyártottam a különböző adattípusok kedvéért, csak hogy legyen kódkiegészítés:

```
abstract class AbstractBlogItemList {
    abstract public function get($index);
}
class BlogPostList  {
    /**
     * @return BlogPost
     */
    public function get($index) {
    }
}
class VideoBlogPostList  {
    /**
     * @return VideoBlogPost
     */
    public function get(int $index) {
    }
}
```

Na ennek vége:

```
abstract class BlogItemList<T as BlogItem> {
    /**
     * @return T
     */
    public function get(int $index) : T {
    }
}
```

Aki már programozott C++-ban vagy Javaban az ismeri ezt a fajta megadást: ezek a genericek vagy templatek. A `T` egy adattípust helyettesít, és amikor példányosítjuk a `BlogItemList` osztályt, akkor derül ki, hogy a `T` mi is valójában. Söt, megadhatunk megkötéseket a `T`-re, például itt bekorlátoztuk a BlogItem gyerekosztályaira.

## Hátrányok

Nem ragozom tovább, szerintem ezen a ponton átjött a lelkesedésem a nyelv iránt. A többi fícsört megtalálot [a hivatalos doksiban](https://docs.hhvm.com/hack/).

Mielőtt azonban eldobnál kapát-kaszát és holnaptól csak Hackben programoznál, beszéljünk kicsit a hátrányokról.

### Hiányzó IDE támogatás

Sajnos PHP-ra egyetlen normális, kódkiegészítést adó IDE létezik, ez pedig a PHPStorm, a többi versenyző évtizedekkel kullog utána. Hacklanghez jelenleg nincs jó, kódkiegészítést adó IDE. A Facebook által fejlesztett [Nuclide](https://nuclide.io/) kódkiegészítése a SublimeText szintjén van, nem ad olyan mély, automatikus kódkiegészítést vagy automatikus refaktorálási eszközöket mint mondjuk a PHPStorm, vagy Javara szinte bármelyik modern IDE.

Valahol érthető is, hogy sem Jetbrainsék, sem más nem vágott még bele a Hack támogatás megírásába, hiszen a Facebookon kívül nem sok projekt használja még. Jetbrainséknél van erre egy [nyitott funkció-igény](https://youtrack.jetbrains.com/issue/WI-21737), aki szeretne Hacklangben fejleszteni, annak mindenképpen érdemes szavaznia.

### Hiányzó dokumentáció

Mint megannyi fiatal projekt esetén, a Hacklang dokumentációja kissé hiányos. A `Stringish` létezésére csak egy [StackOverflow kérdés](http://stackoverflow.com/questions/41192148/check-if-a-variable-is-convertible-to-a-string-in-hacklang/41192459) után jöttem rá, a hivatalos dokumentációban nem szerepel. (Igaz, a válasz perceken belül érkezett.)

Én személy szerint szabadidőm függvényében segíteni fogok a dokumentáció simogatásában, de tisztában kell lenni azzal, hogy a nyelv megtanulása némi időt és legfőképpen kisérletezést vehet igénybe.

### Hiányzó extensionök

A HHVM kizárólag a leggyakrabban használt PHP kiegészítőket valósítja meg. A lista [méretes](https://docs.hhvm.com/hhvm/extensions/introduction), de arra ne számítsunk, hogy tetszőleges PECL kiegészítőt fel tudunk tenni. Ha a projektünk például SSH2-t használ, akkor itt workaroundok használatára lesz szükségünk.

### Ronda transpile-olt kód

Mint az elején írtam, van lehetőség a Hack kód automatikus átalakítására PHP-ra. Ez a kód azonban nem lesz szép, és ami fontosabb: karbantartható. Ez a funkció kizárólag arra jó, hogy egy HHVM-et futtatni nem hajlandó ügyfél kezébe nyomjuk a projektet és sok sikert kívánjunk hozzá.

### Nem 100%-os a typechecker

A HHVM typecheckere nem feltétlenül ad szigorú hibát mindenre, ami problémás lehet. A tömb iterátor függvények, például a [next()](http://php.net/next), nem ellenőrizhetőek a typecheckerrel. Erre viszont nem kapunk hibát, hanem külön ellenőriznünk kell a typechecker coveraget.

## A PHP jövője

Sokan szeretik a PHP-t leírni komolytalan nyelvnek. Ez talán annak köszönhető, hogy annak is indult: az eredeti rövidítés az volt, hogy [Personal Home Page Tools](http://php.net/manual/en/history.php.php). Az elmúlt években a core team elég látványosan rendbe szedte a nyelvet, kapott rendes Abstract Syntax Tree-t, [erősen típusos üzemmódot](http://php.net/manual/en/functions.arguments.php#functions.arguments.type-declaration.strict) és a Jetbrainsnek köszönhetően kevesebbet kell agyalni azon, hogy mi is a típusa az adott változónak.

Mára már nem csak néhány ezer soros HTML-PHP katyvasz projektek léteznek, hanem komoly, havi több százezer vagy akár millió dolláros elszámolási rendszerek is íródnak PHP-ban. Miért? Mert maga a nyelv egyszerű. Nincs 18 féle tömb megvalósítás benne, egyszerű bele kezdeni és üzemeltetni de a tudás plafon hihetetlenül magas. Ezekhez a nagy projektekhez viszont elegedhetetlen a fordítási idejű ellenőrzés, a szigorú típusosság és a kódkiegészítés.

Én bízom benne hogy a PHP core fejlesztők látják ezt az igényt, és azt a hozzáadott értéket amit a Hacklang képvisel és folytatják azt a jó utat amin elindultak. Bízom benne, hogy ezek a funkciók előbb-utóbb bekerülnek a PHP-ba is.