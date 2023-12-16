---
id: 2785
title: 'PHP 8.0 – Az OPCache-től a JIT-ig – Pt. I.'
date: '2020-12-24T13:14:51+01:00'
author: adam.turcsan
layout: post
guid: 'http://letscode.hu/?p=2785'
permalink: /2020/12/24/php-8-0-az-opcache-tol-a-jit-ig-pt-1/
newsphere-meta-content-alignment:
    - align-content-left
amazonS3_cache:
    - 'a:3:{s:54:"//letscode.huassets/uploads/2020/12/php_flow1.png";a:1:{s:9:"timestamp";i:1702651418;}s:50:"//letscode.huassets/uploads/2020/12/kep-2.png";a:1:{s:9:"timestamp";i:1702651418;}s:50:"//letscode.huassets/uploads/2020/12/kep-3.png";a:1:{s:9:"timestamp";i:1702651418;}}'
image: 'assets/uploads/2020/12/php8jit1-1.png'
categories:
    - Backend
    - PHP
    - Újdonságok
tags:
    - jit
    - php7
    - php8
---

<div class="wp-block-group"><div class="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow"><div class="wp-block-group"><div class="wp-block-group__inner-container is-layout-flow wp-block-group-is-layout-flow">Egy múltkori [Podcast](https://shows.acast.com/5aeff6d96eb47cc259946df2/episodes/javitsunk-meg-minden-szoftvert "Podcast") részben említettem, hogy mennyire izgatott vagyok a PHP 8.0 újdonságait illetően, és bár ígéretet nem mertem akkor tenni, azért pedzegettem, hogy szeretnék írni, miért is vagyok olyan izgatott, hátha kicsit titeket is felkorbácsol és kedvet kaptok játszadozni a PHP-val és újdonságaival.

Az egyik legnagyobb és talán legkomplexebb újdonsága az új PHP verziónak az ún. **JIT compiler**, ami sok PHP fejlesztőnek nagy valószínűséggel nem sokat mond. Ezzel a feltételezéssel azért merek élni, mert eleve nem igazán kell foglalkozni a PHP esetében a "compiling" folyamatokkal, mivel a PHP az hagyományosan az interpretált nyelvek közé tartozik. Ebben a két részes "sorozatban" végig nézzük, hogyan jelentek meg újabb és újabb eszközök a PHP-ban a performancia növelésének érdekében, ezek hogyan és miért működnek, hogyan tehet ehhez még hozzá a JIT, és egyáltalán, hogyan is értelmezi és futtatja a PHP runtime a kódunkat.

Első körben nézzük meg az általános futtatást, mindenféle trükk nélkül. Megírjuk a szkriptet, azt tokenekre bontja, majd értelmezi az "értelmező", és abból ún. opcode lesz, amit értelmez a virtuális gép és már hajtja is végre a gép a műveleteket, az alkotó meg pihen.  
De fejtsük is ki gyorsan, ez mit is jelent részletesebben.  
A megírt szkript először bekerül egy **Parser**be (értelmező). Ennek része a Lexer/Tokenizer, ami codestyle-októl független kódelemekre (token) bontja a nyers kódot, amiből aztán egy ún. AST-t ([Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree "Abstract Syntax Tree")) állít elő, majd ebből **opcode-okra fordítja a kódunkat**. Ez az opcode fogalmilag megegyezik pl. a Java-s byte code-dal, az elnevezés gyökere a "gép által közvetlenül végrehajtható műveletek" utasításaira utalnak, de ezek még nem azok. Ezt az opcode-ot, (ahogy a Javanál is) egy **virtuális gép** (VM) hajtja végre, ami már képes közvetlenül a gép által végrehajtható utasításokat kiadni az opcode-ok mentén. Itt történik egy új, hagyományos értelemben vehető compilation. Ez már gépi kódot alkalmaz.

<figure class="wp-block-image">![](http://letscode.huassets/uploads/2020/12/php_flow1.png)</figure>Már utaltam a Javara is, de több nyelvnél is ismerhetünk virtuális gépeket, a másik elég gyakran használt VM az LLVM. Mindkettő (a JVM és az LLVM is) számos nyelv futtatásának alapjául szolgál, a PHP VM-je viszont nyelv specifikus ezért is kap külön, a nyelvtől függetlenül kevés figyelmet. (Ami esetleg sokakat elért, az a Facebook által fejlesztett HHVM, ami a Zend VM helyett egy másik futtatási környezetet ad a PHP számára. Erre itt most nem térünk ki jobban.)

Megközelítőleg tehát a fenti az az általános folyamat, amit talán minden PHP fejlesztő idővel megismer. De ne álljunk meg itt!

Bár azelőtt is elérhető volt kiegészítőként, a PHP 5.5 verzió óta a runtime része az [**OPCache**](https://www.php.net/manual/en/intro.opcache.php "OPCache") (Opcode cache).  
Az OPCache egy nagyon fontos – performancia szempontjából – gyenge pontját javította meg a PHP-nak. A PHP egyik nagy előnye és erőssége a "Share nothing architecture", ami a gyakorlatban annyit jelent, hogy két HTTP kérés között az alkalmazás teljesen lebomlik, a lefoglalt és használt memória területek kiürülnek, felszabadulnak. Hátránya ennek nyilván az, hogy ez hosszú inicializálási időt eredményez, az első ábrán látható sokszor hosszadalmas lépés sorozat miatt, ami minden végrehajtás előtt megtörténik.

Az OPcache ezt a problémát úgy oldja fel, hogy a Parser által feldolgozott fájlok opcode-ját egy közös memória területre (tehát ami nem szabadul fel egy HTTP kérés kiszolgálása után) letárolja, és mielőtt a következő kérés során szükséges fájlokkal megkezdené a Parser a munkát, megnézi, hogy van-e érvényes cache-elt változat a forráshoz tartozó opcode-okról, és amennyiben igen, a teljes AST építés és Compiling lépéseket kihagyva a letárolt opcode-okat küldi el a VM-nek.

<figure class="wp-block-image size-large">![]({{ site.url }}assets/uploads/2020/12/kep-2.png)</figure></div></div></div></div>Ugyan az OPCache sok terhet levett a Parser válláról még fontos dolgok felett szemet hunytunk. Az alkalmazásunk – jó esetben – sok, kis méretű fájlokból áll össze. Osztály és függvény definíciók, sokszor nagy mennyiségű külső függőségek, stb. Az, hogy ez a sok fájl mind használható legyen, és mindet megtalálja a PHP, futás közben egy "**autoloading**" nevű mechanizmust alkalmaz. Ez egy elég egyszerű folyamat: ha futás közben nem talál egy osztály definíciót a parser, akkor triggerel egy eseményt, melynek tartalma az osztály [FQN](https://www.php.net/manual/en/language.namespaces.rules.php)-je. Erre az eseményre az [spl\_autoload\_register](https://www.php.net/manual/en/function.spl-autoload-register.php)-rel lehet feliratkozni, ahol egyszerű eljárásokat adhatunk meg, ami megkeresi, hogy az osztálynevekhez tartozó fájl hol található. Ha itt van eredmény, és a fájl elérhető, a PHP betölti a fájlt.

Itt merülhet fel bennünk a kérdés, hogy vajon az OPCache ebből mit tud. Az OPCache egy fájl elérési útjához tartozó opcode-okat tartalmazza. Ez itt viszont még egy gyenge láncszemet eredményez: kell tudnunk a fájlok elérési útját, hogy egyáltalán leellenőrizhessük, a fájlhoz van-e cache-elt változat, és természetesen itt azt is ellenőriznünk kell, hogy ez a cache-elt változat még érvényes-e. A fájlok elérési útjának minél gyorsabb és hatékonyabb előállítására, és az I/O műveletek megspórolására ajánlom a [composer autoloading optimalizációit](https://getcomposer.org/doc/articles/autoloader-optimization.md). Még ha a legtöbb I/O műveletet ezekkel a módszerekkel meg is tudjuk spórolni, a cache invalidációhoz kapcsolódó ellenőrzést nem, ami viszont a legtöbb esetben fölösleges CPU és I/O művelet jelent.

Erre kínál megoldást a PHP 7.4-ben érkezett **preloading**.

<figure class="wp-block-image size-large">![]({{ site.url }}assets/uploads/2020/12/kep-3.png)</figure>A preload a teljes cache invalidációs ciklust mellőzni képes. Ez azzal jár, hogy minden listázott szkriptet memóriába betölt a rendszer mikor a mod-php vagy a php-fpm felépíti a process/thread poolt. A preload során az előre megadott fájlok teljesen feldolgozásra kerülnek, és a VM által állandóan elérhetőek már opcode formátumban a cache-ből. A cache ellenőrzésekor ezek a cache bejegyzések egy "perzisztens" flaget kapnak, ami jelzi, hogy sem időalapú, sem tartalom alapú invalidációra nincs szükség, a betöltött opcode-ok mindig ott maradnak.

A mai PHP-s alkalmazások már egyre ritkábban kerülnek "shared hosting" szolgáltatók tárhelyeire, legalábbis azok biztosan, amelyek performancia érzékenyek. A preloading használata üzemeltetési kérdés is, mert a PHP runtime (.ini-s) konfigurációjának módosításával tudjuk egyáltalán elérni, és így érvényes lesz az összes, ugyanezen runtime-on futtatott alkalmazás esetén is. Manapság, amikor legtöbb esetben "minimum" egy Docker image-be be van csomagolva a szállított alkalmazás, ez már annyira nem elrettentő.

A preloadot az OPCache részeként implementálták. Beállítani a következőképpen lehetséges:  
`opcache.preload=/path/to/preload_script.php`  
A `preload_script.php` tartalma valójában egy átlagos PHP szkript, amiben egyedileg megadhatjuk, hogy melyek legyenek azok a fájlok, amiket szeretnénk előre betölteni.

A fenti két bekezdés eredményeként látható, hogy azon túl, hogy a shared hosting szolgáltatók vendégszeretetét nem tudjuk így már kihasználni, a "beesesházunk és átírjuk" típusú fejlesztést sem tudjuk alkalmazni, hisz teljes restartot igényel az új osztályok betöltése. De gyorsabb az alkalmazás, és úgyse csinálnánk olyat, ugye?!

Most, hogy már látjuk, körülbelül milyen lépéseken keresztül jutunk el a futtatott kódig és mennyi eszköz a rendelkezésünkre áll a teljesítmény növelésre, a következő részben áttérünk a JIT-re és megnézzük, hogyan képes még ezek mellett új kapukat megnyitni.

Források:  
<https://www.zend.com/blog/exploring-new-php-jit-compiler>