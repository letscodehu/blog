---
id: 1513
title: 'Félreértett programnyelvek: PHP'
date: '2016-08-17T06:50:57+02:00'
author: janoszen
layout: post
guid: 'https://www.refaktor.hu/?p=1513'
permalink: /2016/08/17/felreertett-programnyelvek-php/
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
    - '10035'
avada_post_views_count:
    - '10035'
sbg_selected_sidebar:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_replacement:
    - 'a:1:{i:0;s:12:"Blog Sidebar";}'
sbg_selected_sidebar_2:
    - 'a:1:{i:0;s:1:"0";}'
sbg_selected_sidebar_2_replacement:
    - 'a:1:{i:0;s:0:"";}'
image: 'assets/uploads/2016/08/29123210/47628609_m.jpg'
categories:
    - Fejlesztés
tags:
    - php
---

Talán meglepő egy ilyen cím 21 évvel a nyelv megjelenése után, de érdemes megnézni, hogy a világ harmadik legnagyobb oldalát hajtó technológia hova fejlődött az elmúlt pár évben.  
  
Félreértés ne essék: a PHP egy öreg nyelv, és a fejlődése nem éppen mérnöki alapokon történt. Ennek megfelelően rengeteg olyan dolog került a nyelvbe, ami miatt a PHP-t sokan komolytalannak sorolják be. Az azonban tagadhatatlan, hogy webes fejlesztéseknél az egyik legkönyebben üzemeltethető versenyző, és az elmúlt években a közösség és [a fejlesztő csapat is](https://secure.php.net/credits.php) rengeteg energiát fektetett abba, hogy a nyelv felnőjön azokhoz a modern webfejlesztés során felmerülő feladatokhoz.

Nézzük tehát, hogy mi is az a PHP és hogyan érdemes használni?

## Működési elv

A PHP elsődleges feladata weboldalak kiszolgálása. Működését tekintve a PHP program akkor indul el, amikor beérkezik egy HTTP kérés. A PHP program a futása alatt ezt az egyetlen kérést szolgálja ki, majd be is fejezi a működését. Ez szöges ellentétben áll azzal, ahogy például a Java vagy a NodeJS működnek, és ennek a fajta működésnek van néhány következménye:

- Mivel a PHP program minden lekérésre újraindul, minden feldolgozás (config fájl olvasástól kezdve a különböző adatok betöltéséig) hozzá tesz a válaszidőhöz. Az egyetlen megoldás a cachelés, viszont ez nem feltétlenül teszi egyszerűbbé a programot.
- Ugyanakkor egy átlagos PHP programozónak csak viszonylag keveset kell a memória fogyasztással foglalkoznia, hiszen a lekérdezés végével a lefoglalt memória felszabadul.
- Mivel a PHP futások egymástól nagyrészt függetlenek, és néhány egzotikus kivételtől eltekintve nincs osztott memória, így a PHP programozáskor az ezzel kapcsolatos helyzetek kezelésével sem kell foglalkozni. (Gondoljunk csak a Java synchronized blokkjaira, vagy a lockolására.)
- Mivel a PHP egy no-share architektúrát valósít meg és a filerendszer kezelése [streamek](https://secure.php.net/manual/en/book.stream.php) segítségével elfedhető, a skálázásnál általában nem a PHP futása, hanem az adatbázis jelenti a szűk keresztmetszetet.
- Mivel minden kérés külön PHP szálat igényel, a PHP csak nagyon korlátozottan alkalmas hosszú futásidejű feladatok végrehajtására. (Chat, websocket, long polling, stb.)
- Mivel a PHP futási időben fordul, fejlesztés közben nincs szükség hosszas buildelésre, minden módosítás azonnal látható. Éles környezetben pedig az [OPcache](https://secure.php.net/manual/en/book.opcache.php) gondoskodik a sebességről.

Éppen ez a fajta architektúra adja a PHP vonzerejét. Amíg más nyelveken egy tisztességes programozónak szinte kötelező ismernie a különböző párhuzamosítással járó buktatókat, PHP-ban ezt igen könnyen meg lehet úszni meglepően hosszú ideig. Ez persze nem azt jelenti, hogy egy PHP programozónak ne kellene ismernie [Andrew S. Tanenbaum](https://hu.wikipedia.org/wiki/Andrew_S._Tanenbaum) könyveit, de a valóság az, hogy ez sajnos más programnyelvek fejlesztőinél is igen gyakran kimarad.

A fentiek persze nem azt jelentik, hogy a PHP csak így képes működni. Parancssorból ugyanúgy futtatható egy PHP program, sőt, még saját folyamatokat is indíthat a [PCNTL modullal](https://secure.php.net/manual/en/book.pcntl.php) vagy socketeket is nyithat. Elvben tehát megvan a lehetőség arra, hogy akár webszervert is írjunk PHP-ban, azonban a gyakorlat azt mutatja, hogy a memória-hatékony programok írása PHP-ban, részben a hiányzó eszközkészlet miatt, részben pedig az ismert memleak-problémája miatt meglehetősen nehezek. Ugyan léteznek olyan kezdeményezések mint az [appserver.io](http://appserver.io/), de ezek megmaradtak a PHP világ peremterületein.

## A nyelv struktúrája

A nyelv struktúráját tekintve egy keverék a Java-stílusú objektum orientáció és a klasszikusabb procedurális nyelvek között. Ez azt jelenti, hogy ugyanúgy írhatunk procedurális kódot, mint objektum orientáltat. A legtöbb beépített függvény (sajnos) még a klasszikus struktúrát követi, nagyon kevés funkció rendelkezik objektum orientált megfelelővel.

A PHP egy gyengén típusos nyelv, ami azt jelenti, hogy maga a futtató automatikusan átkonvertálja a változók tipusait egymás között. így például a következő kifejezések értelmezésre kerülnek:

```
// Az ures string megfeleltetheto boolean hamissal
var_dump("" == false); //true

// A nem ures string megfeleltetheto a boolean igazzal
var_dump("Hello world!" == true); //true

// A 0-t tartalmazó string boolean false-nak felel meg.
var_dump("0"  == false); //true
var_dump("00" == true); //true
var_dump("1"  == true); //true
```

Szerencsére a PHP-ban rendelkezésünkre áll a szigorúan típusos összehasonlító operátor (`===`), amivel kikapcsolható az automatikus típuskonverzió. PHP 7-től kezve pedig a függvényekben megadhatjuk, hogy milyen adattípust várunk és adunk vissza a függvényeinkben:

```
function foo(string $bar) : int {
}
```

Sajnos ez a fajta támogatás még kezdetleges, csak alaptípusokat és osztályneveket adhatunk meg, de arra már például nincs lehetőségünk, hogy megadjuk, hogy pl. BlogPost objektumok listáját várjuk. Ez Javaban például így nézne ki:

```
void foo(List<BlogPost> $bar) {
}
```

PHP-ban ezzel szemben csak arra van lehetőségünk, hogy tömböt követeljünk meg, amiben bármi lehet:

```
function foo(array $bar) {
    foreach ($bar as $b) {
        if (!$b instanceof BlogPost) {
            throw new InvalidArgumentException();
        }
    }
}
```

Szóval típuskényszerítés terén még van hova fejlődni, de elmondható, hogy a PHP koránt sem az a típusmentes nyelv ami egyszer volt. [Talán egyszer bekerül a nyelvbe.](https://wiki.php.net/rfc/generic-arrays)

### Tömbök

Sok más nyelvvel ellentétben a PHP-ban keveredik a lista (vagy array) és a hashmap (vagy dict) fogalma. Amíg más nyelvekben külön konstrukció van az elemek listájára és a kulccsal indexelt tömbökre, addig a PHP-ban a két konstrukció keveredik `<a href="https://secure.php.net/manual/en/language.types.array.php">array</a>` néven.

A tömbökről azt érdemes tudni, hogy az univerzális jellegüknek köszönhetően rengeteg memóriát használnak. A probléma megkerülésére implementálták az [SPL adatstruktúrákat](https://secure.php.net/manual/en/spl.datastructures.php), amik ugyan hatékonyabbak, de soha nem kerültek szélesebb felhasználásra.

Lehetőségünk van a beépített tömb-szerű adatstruktúrák mellett saját adatstruktúrák implementálására is. Ezt a célt szolgálják például az [ArrayAccess](https://php.net/ArrayAccess), [Iterator](https://php.net/Iterator) vagy a [Traversable](https://php.net/Traversable) interfacek. Ezekkel például lehetőséget adhatunk arra, hogy foreach-el végig menjünk az objektumainkban tárolt adatokon.

Sajnos ezek az interfacek nem száz százalék kompatibilisek a beépített tömbökkel. Hiába várnánk el, az ezeket az interfaceket implementáló objektumaink nem fognak működni [a PHP beépített tömbfüggvényeivel](https://secure.php.net/manual/en/ref.array.php).

Arra is érdemes figyelni, hogy a beépített PHP tömbök hibakezelése kimerül a `notice`-szintű hibaüzenetek logolásában. Ez azt jelenti, hogy az elvárt adatmezők meglétét minden egyes alkalommal ellenőrizni kell, ami rengeteg fölösleges boilerplate kód írásával jár. A PHP-ban karbantarthatóság jegyében érdemes a beépített tömbök használatát messzemenően elkerülni, különösen ha több mélységű adatstruktúrát valósítunk meg. Helyette az előbb említett interfacek segítségével érdemes egy célhoz kötött osztályt készíteni.

### Hibakezelés

A PHP alapbeállításon meglehetősen megbocsájtó a hibáikkal szemben. Így ha például egy nem definiált változó vagy tömbindex esetén a logba bekerül egy `notice` szintű hibaüzenet, de a programunk futása nem áll le. Ugyanígy nagyon sok beépített PHP függvény `notice` vagy `warning` szintű hibákat jelzi – a visszatérési érték mellett – hogy a feldolgozás hibára futott.

PHP 7-től kezdve [a meglehetősen körülményes központi hibakezelő](https://secure.php.net/set_error_handler) mellett lehetőség van a klasszikus PHP hibákat szintén exceptionök formájában elkapni. Ehhez a try-catch blokkokban vagy az `\Error` osztályt, vagy a `\Throwable` interfacet kell elkapnunk.

### Névterek

PHP 5.3 óta [lehetőségünk van névterek definiálására](https://secure.php.net/manual/en/language.namespaces.rationale.php). Ez azt jelenti, hogy a programunkat egy névtérbe helyezve (például `SajatCeg\SajatProjekt`) definiált osztályok, függvények nem fognak ütközni egy másik névtérben levő elemekkel még akkor sem, ha összevonjuk a két projektet egy közös kódbázisba.

Ez a fajta kódszervezés széles kőrű elfogadottságra talált, és a kódszervezésen kívül a hatékony kódbetöltés alapját is képezi. (Lásd lentebb.)

## Egy PHP program felépítése

A PHP közösségben nagyrészt elfogadott nézetek szerint PHP-ban illik objektum orientáltan programozni, a függőségek, külső programkönyvtárak kezelésére pedig [composert](https://getcomposer.org/) illik használni.

A composer nem csak a különböző csomagok kezelésében nyújt segítséget, hanem biztosít egy [autoloadert](https://secure.php.net/manual/en/language.oop5.autoload.php) is, ami az osztályok automatikus betöltéséért felelős. Ennek megfelelően egy modern PHP program könyvtárában találunk egy `composer.json` fájlt, például ezzel a tartalommal:

```
{
  "name": "mycompany/mysoftware",
  "autoload": {
    "psr-4": {
      "MyCompany\\": "./src"
    }
  },
}
```

Ennek megfelelően az osztályaink az `src` könyvtárban laknak. A PSR-4 szabványnak megfelelően a `MyCompany\BusinessLogic\TestBusinessLogic` osztály a `src/BusinessLogic/TestBusinessLogic.php` fájlban foglal helyet. (PHP-ban a `\` jel a névtér elválasztó.)

Ahhoz, hogy a programunk el is tudjon indulni, készítünk egy `htdocs` könyvtárat, majd abban egy `index.php` fájlt. A webszerverünket úgy konfiguráljuk, hogy minden lekérdezés az `index.php` fájlra menjen, kivéve azokat a fájlokat, amik ténylegesen léteznek a `htdocs` könyvtárban. Ezt elérhetjük például az Apache webszerver alatt a következő .htaccess fájllal:

```
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
```

Régebbi, rosszabb minőségű programok esetén láthatunk olyat, hogy minden funkciónak külön `.php` fájlja van (`index.php`, `blog.php`, `shop.php`), ezt azonban érdemes elkerülni, mert több belépési pont esetén könnyen hiba csúszhat a jogosultság ellenőrzésbe vagy a bemeneti változók biztonságos kezelésébe.

Az `index.php` fájlban pedig betöltjük a composer által létrehozott autoloadert:

```
<?php

require_once(__DIR__ . '/../vendor/autoload.php');
```

Innentől kezdve pedig használhatjuk az osztályainkat az index.php-ban a programunk elindítására.

### PSR-7

PHP-ban alapvetően a `$_SERVER`, `$_GET`, stb változókon keresztül érjük el a felhasználótól érkező adatokat. A gond ezzel az, hogy ezek szuperglobálisok, azaz mindenhol rendelkezésre állnak. Ha a kódunkban közvetlenül használjuk ezeket a változókat, akkor nincs lehetőségünk a programunk indulása közben biztonsági ellenőrzést végezni, stb.

Éppen ezért a [PHP Framework Interoperability Group](http://www.php-fig.org/) kiadott [egy szabványt PSR-7 néven](http://www.php-fig.org/psr/psr-7/) ami szabályozza a requestek és response-ok kezelését. A szabvány szerint a programunk futása legelején a szuperglobálisokból készítünk egy PSR-7 server request objektumot, és a továbbiakban kizárólag azt használjuk. A válasz feldolgozásánál szintén PSR-7 választ készítünk, majd a programunk legkülső rétegében küldjük ki ténylegesen a választ a böngészőnek.

Noha a PHP-FIG egyik szabványa sem mentes a hibáktól, sőt néha fájó hülyeségeket tartalmaznak, a munkájuk mégis komoly előrelépést jelent a különböző frameworkök, függvénykönyvtárak közötti adatátadás tekintetében, és sokkal átláthatóbbá teszi a kódot.

### Routing

Tekintettel arra, hogy minden lekérdezés egy központi `index.php` fájlon köt ki, minden modern PHP programnak szüksége van egy útválasztó (routing) rétegre, ami a PSR-7 request alapján eldönti, hogy mely osztály mely függvénye felelős az adott útvonal (pl. `/user/1` ) kiszolgálásáért. (Ezt divatos nevén controllernek is hívják az [MVC elv](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) alapján.) A legtöbb framework biztosít ilyen útválasztó réteget, de szép számmal [találunk erre a feladatra a PHP csomagokért felelős Packagisten független könyvtárakat is](https://packagist.org/search/?q=routing).

### Template kezelés

A PHP önmaga is egy template nyelvként indult, hiszen a PHP kódba közvetlenül is ágyazhatunk be HTML-t, például így:

```
foreach ($foo as $bar) {
    ?>Bar: <?=$bar ?>! <?php
}
```

Ha már programoztál nagyobb rendszert, talán mondanom sem kell, hogy ez egy több ezer soros programnál mennyire rossz ötlet. Szerencsére a PHP közösség számos template engine-t írt, ilyen például a [Jinja2](http://jinja.pocoo.org/docs/dev/)-re hasonlító [Twig](http://twig.sensiolabs.org/), vagy a már kissé korosnak számító [Smarty](http://www.smarty.net/).

Ezek nem csak a templatek írását könnyítik meg, hanem egy fontos részét képezik a védelmi vonalunknak, ugyanis a legtöbb template engine automatikusan escapeli a template-be beillesztett változókat. Ez nagyban csökkenti a sikeres XSS támadások esélyét.

### Adatbázisok

A PHP hajnalán az adatbázis kezelés jobbára procedurális alapokon működött, valahogy így:

```
$link = mysql_connect('localhost', 'foo', 'bar');
$result = mysql_query('
  SELECT
    *
  FROM
    users
  WHERE
    username="' . mysql_real_escape_string($user, $link) . '"',
  $link);
while ($row = mysql_fetch_assoc($result)) {
  echo $row['test'];
}
```

Remélhetőleg látszik, hogy mekkora macera volt ezzel megbízható, helyesen hibakezelt, és legfőképpen biztonságos kódot írni. Szerencsére a framework fejlesztők és a programozók nagy része igen hamar rájött, hogy ez a stílus gyakorlatilag könyörög azért, hogy az ember kifelejtsen egy `mysql_real_escape_string` hívást és ezzel lehetővé tegye egy [SQL injection](https://en.wikipedia.org/wiki/SQL_injection) végrehajtását, ezért hamar megszülettek az adatbázist elfedő függvénykönyvtárak.

Egy ilyen a PHP-ba beépített [PDO](https://secure.php.net/manual/en/book.pdo.php), ami lehetővé teszi a változók biztonságos beillesztését a bindParam, bindValue, stb. függvények segítségével, és emellett különböző adatbázis-motorok fölött biztosít egységes réteget. Természetesen a queryket továbbra is hozzá kell igazítanunk az adott adatbázis-motorhoz, de a PDO használatával legalább egységesen használható függvénykönyvtárakat kapunk.

Az SQL queryk egységes kezelése mellett az elérhető CPU kapacitás növekedésével megjelentek az olyan adatbázis absztrakciós rétegek is, amelyek objektum-orientált hozzáférést biztosítanak az adatbázisban tárolt adatokhoz. Ilyen például a [Doctrine ORM](http://www.doctrine-project.org/projects/orm.html) (nem összekeverendő a [Doctrine DBAL](http://www.doctrine-project.org/projects/dbal.html)-al), a [Propel](http://propelorm.org/) vagy a Laravel frameworkhöz tartozó [Eloquent](https://laravel.com/docs/5.2/eloquent).

## Frameworkök

Természetesen nem kell feltétlenül végig küzdenünk ezt az egészet, vannak szép számmal open source frameworkök erre feladatra. Vannak olyanok, amik sok mindent csinálnak, mint például a [Symfony](https://symfony.com/) vagy a [Laravel](https://laravel.com/), és vannak olyanok is, amik kevesésbé veszik ki a kezünkből az irányítást, mint például a [Lumen](https://lumen.laravel.com/) vagy a [Silex](http://silex.sensiolabs.org/). Packagisten [több ezer framework](https://packagist.org/search/?q=framework) közül válogathatunk, így remélhetőleg mindenki talál kedvére valót.

## A PHP rossz hírneve

A PHP fejlesztői körökben meglehetősen rossz hírnévnek örvend, mára már talán kissé jogtalanul is. Néha olyan badarságokat is lehet hallani, hogy a PHP nem is programnyelv, ami egyértelműen hülyeség, hiszen maga a nyelv [Turing-teljes](https://infoc.eet.bme.hu/bf/), ami legjobb tudomásom szerint a legszigorúbb definíció egy programnyelvre. (A futtató környezetről lehet vitatkozni, bár ott különbséget kell tenni az alap PHP, a [HHVM](http://hhvm.com/), a [Quercus](http://quercus.caucho.com/) és a többi alternatív PHP futtató között.)

Kétség nem fér hozzá, a PHP a hírnevét saját magának is köszönheti. A gyenge típusosság, az OOP hiánya, illetve az alacsony belépési küszöb mind-mind hozzájárultak hozzá, hogy hihetetlen mennyiségű gyenge kód született. Ez nem korlátozódik házi projektekre, vagy eldugott webstúdiók munkájára, hanem jó néhány ismertebb CMS is meglepően gyenge kóddal rendelkezett. Néhány CMS komoly erőfeszítéseket tett az architekturális gyengeségek orvoslása érdekében, sok rendszer fejlesztőcsapata viszont nem látja be az alkotásuk hibáit és megmaradtak a régi stílusú PHP-nál.

A kód gyengesége nem korlátozódik a PHP-ra. PHP-ban viszont sokkal könnyebb gyenge kódot írni, mert sokkal elnézőbb a kezdők hibáival szemben. Ezzel szemben egy ilyen rendszerről egy döntéshozó is könnyebben belátja azt, hogy csinálni kell vele valamit, hiszen nagyon rosszul skálázódik, és jó eséllyel az új fejlesztések is komoly bugokkal küzdenek.

Sokkal veszélyesebb egy cég vagy projekt fejlődésére az, amikor a projekt OOP-nek kinéző, szorosan kapcsolt modulok halmazából áll, hiszen ezekből sokkal nagyobb rendszert lehet építeni mielőtt gond lesz belőle. Az ilyen rendszereknél a döntéshozók csak annyit látnak, hogy *minden új fejlesztés hihetetlenül lassú*. Erről bővebben a [Tiszta kód](https://www.refaktor.hu/tiszta-kod-1-resz-teszteljek-vagy-ne-teszteljek/) sorozatunkban írtunk.

A PHP, mint minden más programnyelv is, egy eszköz. Eszközt pedig feladathoz választunk. Remélhetőleg senki nem fog nekiállni PHP-ban chat programot vagy játékszervert írni, mert nem arra való. Ugyanúgy remélhetőleg nem fog senki nekiállni egy kis céges honlapra hatalmas, több szerveres Java architektúrát tervezni.

Ha szeretnénk egy olyan programnyelvet, ahol nem kell sokat agyalni a memóriakezelésen vagy a deployoláson, a PHP jó választás lehet, különösen ha megtámogatod olyan eszközökkel mint a [PHPStorm](https://www.jetbrains.com/phpstorm/), [PHPUnit](https://phpunit.de/) vagy a [Scrutinizer CI](https://scrutinizer-ci.com/). Ezzel szemben ha olyan feladat jön szembe, amire a PHP nem alkalmas, például a fent említett chat program, vagy olyan program, ahol szigorú típusosságra van szükség, esetleg egy nagy elosztott rendszert építünk, nem eretnekség más technológiának is utána nézni. A jó kód ismérvei szinte minden programnyelven ugyanazok, a többi pedig némi tanulással könnyen elsajátítható.

Általánosságban szólva pedig ne nézzünk minden feladatot szögnek csak azért, mert van egy kalapácsunk. Válasszunk olyan technológiát, ami alkalmas a feladat elvégzésére és amihez van kellő szakértelem. Ha pedig neki állnál valamilyen nyelvet szidni ilyen vagy olyan okból kifolyólag, előbb gondolj bele, hogy a választott kedvenc programnyelvedben más legalább ennyi kivetni valót találna.

## További olvasmányok

- [PHP: The Right Way](http://www.phptherightway.com/)