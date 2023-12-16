---
id: 3351
title: 'PHP 8.0 – Az OPCache-től a JIT-ig – Pt. II.'
date: '2020-12-29T14:00:00+01:00'
author: adam.turcsan
layout: post
guid: 'http://letscode.hu/?p=3351'
permalink: /2020/12/29/php-8-0-az-opcache-tol-a-jit-ig-pt-ii/
newsphere-meta-content-alignment:
    - align-content-left
iworks_yt_thumbnails:
    - 'a:1:{s:11:"dWH65pmnsrI";a:5:{s:3:"url";s:55:"http://img.youtube.com/vi/dWH65pmnsrI/maxresdefault.jpg";s:10:"secure_url";s:56:"https://img.youtube.com/vi/dWH65pmnsrI/maxresdefault.jpg";s:5:"width";i:1280;s:6:"height";i:720;s:4:"type";s:10:"image/jpeg";}}'
amazonS3_cache:
    - 'a:3:{s:50:"//letscode.huassets/uploads/2020/12/kep-4.png";a:1:{s:9:"timestamp";i:1702651418;}s:50:"//letscode.huassets/uploads/2020/12/kep-6.png";a:1:{s:9:"timestamp";i:1702651418;}s:50:"//letscode.huassets/uploads/2020/12/kep-7.png";a:1:{s:9:"timestamp";i:1702651418;}}'
image: 'assets/uploads/2020/12/php8jit2-1.png'
categories:
    - Backend
    - PHP
    - Újdonságok
tags:
    - jit
    - php8
---

Az első rész [itt]({{ site.url }}/2020/12/24/php-8-0-az-opcache-tol-a-jit-ig-pt-1/) megtalálható.

A PHP 5.5-től kezdve a PHP 7.0-val és gyakorlatilag az azt követő minor verziókkal mind folyamatos performancia növekedést produkáltak a fejlesztők hol kisebb, hol óriási feature optimalizációkkal. A **JIT** fejlesztése már a 7-es PHP előtt megkezdődött, ahogy azt már több, mint két évvel ezelőtt PHP 7.0-n [tartott látványos bemutatót Zeev Suraski](https://www.youtube.com/watch?v=dWH65pmnsrI). Ezt azért fontos látni, mert bár – ahogy én is teszem – végigvezethető, hogy mikor, miért történt a fejlesztés, valójában párhuzamosan dolgozott a fejlesztő csapat több irányból is a PHP gyorsításán. A JIT egy másik komponens, a VM hátrányait (ahogy az OPCache a Parser hátrányait) igyekszik kompenzálni. (Apró érdekesség, hogy a php-src-ben ZendAccelerator-ként lehet megtalálni ezen fejlesztéseket az OPCache extension-ön belül, mint a motor gyorsításáért felelős funkcionalitások, és nem csak mint "cache".)

A JIT a **Just In Time** rövidítése, és lényegében azt jelenti, hogy az "adott időben", tehát amikor szükség van az eredményre, akkor fut. (Ennek komplementere az AOT, azaz Ahead Of Time.) Ez automatikusan történik, és bár természetesen némi konfigurációt igényel, többnyire észrevétlenül, és az alap felhasználási módot nem zavarva épült be az eszköztárba. Ez fontos, mert a PHP-nak az egyszerűsége és könnyen tanulhatósága az egyik nagy erőssége, és ha a compilation folyamata bekerülne a fejlesztési lépések közé, az nagyban ronthatna a fejlesztői élményen.

A JIT-tel, ahogy azt már korábban is említettem régóta foglalkoznak a fejlesztők. Már a PHP 7-es verziójába szerették volna elhozni, de akkor még bőven volt más terület, ahol a PHP runtime-ot optimalizálni tudták ahhoz, hogy a projekt háttérbe szoruljon, de legalábbis ne legyen szükséges.

Mindemellett a JIT alkalmazásának előnye nem is evidencia, sőt, akár hátrányba is fordulhat. Nézzünk is kicsit bele, hogy körülbelül milyen alapokon működik, hogy megértsük, mikor, miért és hogyan válhat hasznunkra a PHP JIT.

Érdemes néhány pillantást, vagy akár sokkal többet vetnünk a [JIT működési módjának konfigurációjára](https://www.php.net/manual/en/opcache.configuration.php#ini.opcache.jit). A "typical usage" esetén a két fontos rész a "tracing" és a "function", mely kapcsolók fontos különbségeket rejtenek magukban. Valójában ez a kettő egy gyors beállítás, a lenti "advanced usage" egy-egy "preset"-e, ha úgy tetszik. Bár nem feltétlen lesz szükségünk az "advanced usage" beállításokat használni, a fenti két gyorsbeállítás jelentését mégis azok átvilágításán keresztül érthetjük meg a legjobban.

A JIT működését 4 paraméter segítségével tudjuk szabályozni.

- **O** - Optimization
- **T** - Trigger
- **R** - Register allocation
- **C** - CPU-specific optimization flags

Ezek közül számunkra az érdekesség az O és T pontokban rejlik. Az 'O', mint optimalizáció a PHP szkriptek optimalizációjának szintjéről és módjáról rendelkezik. A 'T', mint trigger pedig arról rendelkezik, hogy mikor alkalmazzuk egyáltalán a just in time compilationt, mikor és mekkora szeletét a PHP kódbázisnak szükséges gépi kódra fordítanunk.

Ahogy a fent linkelt dokumentációban is láthatjuk, a **"function" JIT** a 1205-ös beállítást alkalmazza, mi szerint a 0-s trigger (Compile all functions on script load) és 5-ös optimalizáció (Optimize whole script) használja. Ez a gyakorlatban azt jelenti, hogy minden függvényt és azokban minden lehetséges utat megvizsgál a fordító, és azt optimalizálni, majd gépi kódra fordítani igyekszik már a szkript betöltése után (pontosabban már az első futtatáskor).

<figure class="wp-block-image size-large">![]({{ site.url }}assets/uploads/2020/12/kep-4.png)</figure>Ez a beállítás nagyon hamar belátható, hogy csak szélsőséges esetekben hozhat komoly performancia javulást, de a legtöbb esetben inkább fölösleges overheadet jelent, akár be is lassíthatja a működést. Nem csupán azért, mert azzal, hogy megvizsgálja az alkalmazásban definiált összes bejárható utat (aminek javát átlag futáskor az alkalmazás nem is érinti), még azokat optimalizálni is próbálja, ami egy dinamikus, típusok nélküli ilyen-olyan kódbázisban óriási feladat. Minden alkalommal, amikor egy szkript eljut a VM-ig, az átpasszolja azt a JIT-nek, ami a fenti elemzést elvégzi, és letárolja a szkripthez tartozó gépi kódot. A következő futtatásnál már a runtime látja, hogy a szkripthez tartozik gépi kód, így a teljes OPCache-es mizériát kihagyva, kapásból képes futtatni azt. Viszont nem minden kódra képes ezt megtenni a JIT, ezért ahol ez a gépi kód nem állt elő, ott ez újra és újra megtörténik.

Természetesen ez nem azt jelenti, hogy nem lehet haszna ennek a módnak, viszont ehhez, nem nagy túlzással, célzottan ezt hasznosítani képes kódot kell írni.

A fenti másik preset a **"tracing" JIT** beállítás. A trigger 5-ös (Profile on the fly and compile traces for hot code segments), az optimalizáció 4-es (Use call graph). Ez azt jelenti, hogy egy új elemet érdemes külön említenünk, ami a "tracer". A tracer gyakorlatilag egy statisztikát készít a futtatott kódról. Elemzi, hogy mely kódrészletek milyen gyakorisággal (és milyen kontextusban) futottak valójában, és ezen statisztikák ismeretében tudunk küszöbszintet meghatározni. Csak ezen küszöbszintek átlépése esetén nyilvánítja a JIT ezt **"hot code"**-nak, amit egyáltalán érdemes gépi kódra fordítani. A 4-es optimalizáció meg annyit enyhít, hogy csak a szükséges, futtatott kódrészletekre készít gépi kódot, nem a teljes, rendelkezésre álló összes útvonalra.

<figure class="wp-block-image size-large">![]({{ site.url }}assets/uploads/2020/12/kep-6.png)</figure>A tracing JIT megoldása annyiban is összetettebb, hogy a kódszegmenseket kontextusában képes elemezni, fordítani és tárolni. A function JIT-tel ellentétben ez azt jelenti, hogy egyfajta "closure"-szerű megoldást alakít ki a kódszegmensre, és nem csak az adott kódsor, hanem az adott kódkörnyezet kerül kiértékelésre a statisztikában, és *arról* dönt a tracer, hogy érdemes-e JIT-elni.

Most, hogy találtunk életképesnek tűnő megoldást a PHP kódok JIT-elésére, nézzük meg, hogy a valóságban milyen haszna is lehet. Mire lehet eredetileg jó?

Leginkább CPU intenzív feladatokra. Numerikus módszerekre, egyéb elemzésekre, ahol fontos, hogy a processzort a lehető legnagyobb hatékonysággal használjuk ki. Mit jelent ez PHP-s környezetben, ahol az alkalmazásaink túlnyomó többségben:

- Adatbázissal kommunikálnak
- HTTP-n kommunikálnak
- Fájlrendszerrel dolgozik.

Tehát javarészt "I/O bound". Azt, hogy jó esetben még így is örülhetünk, ha valamit elértünk az átlag PHP-s világban. Körülbelüli benchmark eredmények:

<figure class="wp-block-table">| **PHP Benchmark Suite** | 3x gyorsabb |
|-------------------------|-------------|
| **WordPress** | 3-5%-kal gyorsabb |
| **Framework-based Apps** | Nincs különbség |

<figcaption>PHP8-on JIT nélküli eredményhez viszonyítva</figcaption></figure>Bár a PHP Benchmark Suite nem egy elhanyagolható javulást mutat, látható, hogy közel sem a való életben megtalálható alkalmazásokhoz hasonló kódot tartalmaz.

<div class="wp-block-image"><figure class="aligncenter size-large is-resized">![Most akkor mégis miért?]({{ site.url }}assets/uploads/2020/12/kep-7.png)</figure></div>Szóval nem értünk el túl nagy javulást, mégis miért jelenthet nekünk ez fontos mérföldkövet?

Mivel általánosságban elmondható, hogy lassítani nem lassít, kárt nem okoz, viszont van, amikor jól jön, ezért érdemes bekapcsolni és megengedni neki, hogy még egy eszköz gyorsítsa a futtatást.

Emellett lehetővé teszi, hogy az eddig szükséges **C-s implementációkat PHP-val kiváltsuk**. Ha ez most furcsán is hangozhat, kérdem én:

- Gondolkodtál-e már azon, hogy érdemes-e a beépített tömbön és tömbfüggvények helyett saját megoldást használni, ami nem csak tömbökön, de típusos adatokon is képes dolgozni?
- Találkoztál-e már azzal, hogy a beépített függvény éppen csak egy kicsit más, mint, ami kell, újat meg nem akarsz írni, mert nem lesz olyan gyors?
- Hiányzott-e már valami natív megoldás, de C-hez nem értesz, vagy nem akarsz C-ben írni, és extension-t sem akarsz/tudsz telepíteni?

A fenti kérdésekre ha igennel válaszoltál, akkor beláthatjuk, "mire gondolt a költő".

A PHP JIT jelenleg nem képes együtt működni az FFI-s kódokkal, de a jövőben, ha ez megvalósul akár natív közeli "driver"-ek készülhetnek külső eszközökhöz PHP-ra, PHP nyelven.

A másik komoly lehetőség, hogy **a PHP megerősítse gyökereit új alkalmazási területeken**. Ebből az egyik, a komolyabb processzor teljesítményt igénylő, összetettebb numerikus módszereket alkalmazó gépi tanulás. Ezen a területen a JIT-nek hatalmas jelentősége lehet a performanciában, és így a PHP, mint potenciális eszköz választásában. Ráadásul vannak ígéretes eszközök is rá, pl. [RubixML](https://rubixml.com/).

Harmadik terület a **systems/daemon programozás**. A tracing JIT egyik nagy előnye, hogy a hosszan futó alkalmazásokat folyamatosan elemezve idővel folyamatosan gyorsítani képes. Általánosságban kevésbé mondható el, hogy a PHP a hosszan futó alkalmazások terepe, főleg a kérész életű, egy request erejéig élőkre gondolva.

Ugyanakkor fontos látni, hogy a PHP-s fejlesztői eszközök egyre nagyobb hányada PHP nyelven íródik. Gondoljunk a linterre, a statikus analizátorokra, a csomagkezelőre, stb. Ezek mind képesek előnyre szert tenni, és az akadálymentes fejlesztői élményhez elengedhetetlen azonnali visszajelzést megadni. Óriási jelentőséggel bír, ha egy statikus elemző képes másodperceken belül visszajelezni hibás kód esetén és nem szakad meg a flow, amíg lefut a psalm/phpstan.

Emellett egyre jobban terjednek a amphp, swoole, stb. által megvalósított belső eventlooppal rendelkező alkalmazások, amik szintén könnyen előnyre tehetnek szert a JIT-tel. Ezek is hosszan, folyamatosan futó PHP processzekkel dolgoznak.

Mindezek mellett említésre méltó, hogy a fenti két terület (daemon programming, numerikus módszerek), mind kevésbé a "hardcore" szoftverfejlesztők területe, így komoly versenyszám a nyelv egyszerűsége. Sokan pontosan ezért választják a Pythont a fenti területeken, és pontosan ezen előnyökkel rendelkezik a PHP is.

További fejlesztési lehetőségek a JIT-ben, vagy ennek köszönhetően:

- Tovább optimalizálható a VM (újabb, hatékonyabb utasítások)
- FFI támogatása (natív kiegészítők)
- PHP-s gyenge láncszemek detektálása (tracing)
- További optimalizációk

Szóval még tartogat újdonságokat bőven a PHP ezen a területen is, és még nem is beszéltünk arról a temérdek egyéb feature-ről, ami a 8.0-s verzióval érkezik. Lehet arról is fogunk értekezni a jövőben, mindenesetre remélem sikerült átadni, de legalábbis megmagyarázni valamilyen szinten az izgatottságomat a PHP jövőjét illetőleg.

Források:  
<https://www.zend.com/blog/exploring-new-php-jit-compiler>  
<https://wiki.php.net/rfc/jit>  
<https://www.php.net/manual/en/opcache.configuration.php>