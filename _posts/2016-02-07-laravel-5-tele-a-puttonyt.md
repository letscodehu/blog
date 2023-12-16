---
id: 987
title: 'Partizánkodás 3 &#8211; Tele a puttonyt!'
date: '2016-02-07T23:08:13+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=987'
permalink: /2016/02/07/laravel-5-tele-a-puttonyt/
dsq_thread_id:
    - '4560296797'
    - '4560296797'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/01/09202037/mega.png'
categories:
    - Laravel
    - PHP
tags:
    - automation
    - continous
    - integration
    - jenkins
    - laravel
    - php
    - sonarqube
    - testing
---

Az [előző ]({{ site.url }}/2016/01/17/partizankodas-2-csomagolastechnika/)részben elkezdtük csinálni a saját kis composer package-ünket, ami egyelőre még elég szegényes funkcionalitással bír. Most nem ártana telepakolni azokkal a bizonyos tutiságokkal és ha ezekkel végeztünk, elkezdhetünk pár tesztet is ráengedni. Ha mindezen csomagon többen dolgozunk és folyamatos javításokat is eszközölünk rajta, akkor nem árt bekötni egy CI-be, ahol miután összeintegráltuk a változásokat (ez lesz majd a "nightly build"), az általunk (és mások) által írt teszteket végigeresztjük rajta és csak azok sikeressége esetén fogjuk megveregetni a saját vállunkat. Hogyha mégjobban figyelni akarunk a kódminőségre, akkor bekötünk mellé egy SonarQube-ot is, amivel a stílushibákat tudjuk kiküszöbölni.

<figure aria-describedby="caption-attachment-990" class="wp-caption aligncenter" id="attachment_990" style="width: 762px">[![mega](assets/uploads/2016/01/mega.png)](assets/uploads/2016/01/mega.png)<figcaption class="wp-caption-text" id="caption-attachment-990">Aki miatt csecsre fut a build, az meglakol!</figcaption></figure>

#### Mi az a CI?

A CI, azaz continous integration technika arra szolgál, hogy a fejlesztés során a fejlesztők által végzett módosításokat rendszeresen egybeintegráljuk egy ún. mainline-ba (pl. master), lehetőleg úgy, hogy az még működjön is.

A build első lépése az ilyen CI tool-ok esetében, hogy egy ún. workspace-re kihúzzák az adott verziót. Ezt a buildet triggerelheti webhook, történhet fix időpontban, pollolhatja az adott repot változás után kutatva, stb. Ezután igazából már mi szabjuk meg, hogy mit tegyen vele, mert az, hogy ki tudott checkoutolni egy adott verziót még nem jelent semmit, max. azt, hogy a git/svn még él 🙂 Ezután jöhet az, hogy működésre bírjuk a szoftvert, lehetőleg automatizáltan.

Na most mik az ún. működés feltételei?

- **A kód lefordul.** PHP-ben, javascriptben ilyenről nem beszélhetünk, lévén nincs compile, de pl. Java/C# esetében már ezzel kezdődik minden, ha itt megakad a process, mert valami függőség nem stimmel, fájlok hiányoznak, netán szintaktikai hiba van, akkor nincs értelme továbbmenni. PHP esetében ezen a szinten max. az ún. lint lesz segítségünkre, amivel a PHP interpreter végigmegy a fájlon, szintaktikai hibákra vadászva. Javascript esetében ugyanerre a [nodelint ](https://www.npmjs.com/package/nodelint)lehet a jó választás.

- **Unit teszteken átmegy a cucc.** Az objektumorientált programozásban az objektumok interakcióba lépnek más objektumokkal azok publikus metódusain keresztül. Az alapfeltevés az, hogy ha én használok egy másik objektumot, akkor az megfelelően fog működni. Hiszen ha úgy állok hozzá, hogy a többi objektum teljesen random, akkor minden osztályom tele lesz olyan kódokkal, ami megpróbálja áthidalni azt, ha a többiek szarul végezték a dolgukat, nemde? Na most ezt az ún. dokumentáció szerinti működést ezekkel a unit tesztekkel tudjuk elérni. Ennek nem feltétlenül van köze a hibákhoz, hiszen azok egy magasabb szinten keletkezhetnek, itt a tesztek azt az interfészt fogják lefedni, amin keresztül a többi objektum interakcióba lép vele. Tehát x paraméter mellett <del>exceptiont dob a g\*ciba</del> y értékkel tér vissza és így tovább. Erre is megvannak az ún. teszt framework-ök. PHPUnit, QUnit, JUnit és még sorolhatnám. Ha ezeken átmegy a cucc, akkor verzióban eszközölt változtatásokkal az egyes objektumok szintjein nem vágtuk haza a dolgot (már ha jól vannak azok a tesztek megírva).
- **Integrációs teszteken átmegy a cucc** Az integrációs tesztek már egy magasabb szintet képviselnek, mint a unit tesztek. Itt magát a rendszert fogjuk tesztelni egy kerek egészként. Erre szoktak tesztkörnyezeteket létesíteni, tesztadatbázissal. Ilyen teszt lehet az, hogy pl. egy webshop esetében, ha betesszük X terméket a kosárba, akkor az valóban megjelenik a sessionben vagy sessiontáblában, ha mellécsapok egy Sennheiser fülest, akkor a csomagakció valóban látszik, ha megrendelem, akkor megjelenik az admin felületen, stb.
- **Kézi tesztelés** Itt jöhet az, hogy egy csapat alulképzett majmot eléengedünk a gépnek és megnézzük, hogy hány másodperc alatt borítják össze az egészet. Ha ez a szám nagyobb, mint Texas állam átlag IQ-ja, akkor a teszten átment. Ez természetesen nem képezi részét az automatizmusnak, viszont azt követheti, mert itt már a tesztkörnyezetbe kikerült az adott kód és az integrációs tesztek lefutottak, így elvileg kézi tesztelésre alkalmas már a rendszer.

Ha minden lépésen átment, akkor mehet ki abba a bizonyos mainline-ba a dolog. Persze mindezt kiegészíthetik különféle műveletek, pl. JS uglify, typescript/less compile és hasonlók, de mi most egy viszonylag egyszerű példán át akarunk végigmenni a dolgon.[![qgQSe](assets/uploads/2016/02/qgQSe.png)](assets/uploads/2016/02/qgQSe.png)

Ahhoz, hogy ezt elkezdhessük, mindenképp kell egy continous integration tool, na meg egy szerver, amin mindez fut. Most a példára a Jenkins-t fogom használni, mert elég sokan (köztük én is) használják, sokféle integrációval van felvértezve és már eléggé kiforrott anyag. Önmagában nincsenek nagy igényei, de ha sok job van, amiket gyakran építget, akkor már többet ehet a cucc. Ha nincs szerverünk, de mégis érdekel a dolog, saját gépünkre is fel tudjuk hákolni amíg kipróbáljuk, lévén Java servlet containerben fut, ezért windows-os gépünkre is fel tudjuk telepíteni. Persze léteznek más cuccok is a [célra](https://en.wikipedia.org/wiki/Comparison_of_continuous_integration_software).

Leszedni a Jenkins-t [itt](http://pkg.jenkins-ci.org/debian/) tudjuk debianra, [itt ](http://mirrors.jenkins-ci.org/windows/latest)pedig windowsra. Az elindítás még talán menni fog, nézzük meg mikre van szükségünk ahhoz, hogy csináljon is valamit, navigáljunk hát a localhost:8080-ra (alapértelmezetten persze).

Itt bejön a dashboard, amit jelenleg adminisztrátorként látunk.

#### Git mindenek felett

A jenkins alapból nem kezeli a git-et, ehhez telepítenünk kell egy plugint. Ehhez navigáljunk a Jenkins kezelése -> Kiegészítők kezelése menüpontba, itt pedig az elérhető tabra. (localhost:8080/pluginManager/available ) Keressük meg a Git plugint és telepítsük fel, majd indítsuk újra a Jenkinst a pipára kattintva. Ha ez megvan, akkor navigáljunk vissza a dashboardra és készítsünk egy új Itemet, aminek adjuk meg a Lara Admin nevet és jelöljük ki a freestyle project-et a rádiógombok közül.

Ezután jön a projekt konfigurációs ablak. Itt a verziókövető rendszernél válasszuk ki a git-et és írjuk be az előző részben létrehozott [csomagunk]({{ site.url }}/2016/01/17/partizankodas-2-csomagolastechnika/) git repository-jának elérési útját. Alatta lesz egy üres legördülő, amiben ki lehet választani, hogy mivel szeretnénk authentikálni magunkat. Ez attól függően hova is került a projekt változhat, de pl. github esetébne a publikus projekteknél nem szükséges. Ha jól állítottuk be a dolgot, akkor sehol nem látunk csúnya nagy piros szövegeket, tehát a Jenkins képes elérni az adott repository-t.

Ez alatt ki lehet választani az adott branch-et, amit megpróbál majd a Jenkins lehúzni és kicheckoutolni a workspace-be.

Akkor most nyomjunk a lap alján egy mentést. Ezután visszadob bennünket a projekt oldalra, ahol a bal oldali menüben bökjünk rá az "Építés most" gombra. A lenti build queue-ban megjelenik egy pillanatra az aktuális build, de szinte azonnal be is fejeződik és a kis villogó gömb mellette kékre vált. Lefutott egy build. Jee!

Nyissuk hát meg, nézzük mi is történt az imént! A buildeket minden projekt esetében számmal azonosítja a jenkins. E felé a szám felé véve az egeret meglátjuk a kis legördülőt, amiből válasszuk ki a console output-ot. Itt láthatjuk, hogy milyen parancsokat futtatott a jenkins és mi is volt rá a konzol kimenet.

```
<pre class="console-output" data-language="shell">Building in workspace /var/lib/jenkins/jobs/Lara Admin/workspace
Cloning the remote Git repository
remote: Counting objects
remote: Compressing objects
Receiving objects
Resolving deltas
Updating references
Checking out Revision 5cfa21769defa8852efc632defa03037f21c006d (refs/remotes/origin/master)
First time build. Skipping changelog.
```

Na most ezzel egyelőre sokra nem megyünk. Annyi történt, hogy a jenkins kicheckoutolta a projektet a mappába. Mivel laravel package-ről beszélünk, most jöhetnek azok a bizonyos PHPUnit tesztek. Ugye megvan még a projektünk? Ha nincs, akkor a legutóbbi verziót [itt ](assets/uploads/2016/02/admin-interface.zip)találjátok.

Na most ha előttünk a projekt, akkor mi lenne, ha írnánk bele valami betyáregyszerű tesztet? Azt kipróbáljuk magunknál és utána megnézzük, hogy az automatizálásba mennyire lehet beleilleszteni.

> Mielőtt megkavarodunk, mi most nem a komplett laravelt akarjuk tesztelni, hanem a csomagot, amit készítettünk hozzá. Viszont ez a csomag függ a **laravel/laravel** csomagtól (igazából lehet megoldható csak alrészekkel, de előbb-utóbb bővülnek a függőségek, ahogy egyre több részét használjuk és jobb a békesség), tehát azt composerrel biztosítani kell számára. A fő cél, hogy ne farok csóválja a kutyát, azaz a csomagunkat ne kelljen beletenni egy laravel projektbe ahhoz, hogy működésre bírjuk és tesztelni tudjuk azt, hanem kifordítjuk azt, és a csomagunk köré húzunk composerrel egy laravelt, valamint, lévén a különböző Facade-ekkel és hasonlókkal nem szeretnénk szívni, behúzzuk még az **orchestral/tetsbench** package-et is, ami nagyban segít majd csomagjaink tesztelésében.

Tehát az első lépés egy composer install lesz. Ekkor szépen az IDE kifehéríti nekünk az eddig vészesen pirosló use sorunkat.

#### A composer.lock

A composer, ahogy az előző [cikkemben ]({{ site.url }}/2015/03/12/composer-a-php-fejlesztok-kedvenc-zeneszerzoje/)is volt már róla szó, a composer.json fájl tartalma alapján húzza le a függőségeket. Amikor ezzel végez, akkor láthatjuk a kimeneten a Writing lock file-t is. Ekkor a composer beleírja az éppen aktuálisan lehúzott verziókat.

Ugye az esetek többségében nem explicit verziót adunk meg, hanem wildcardokat alkalmazunk, pl. 5.\*. A lock fájl arra szolgál, hogy rögzítse a pontos verziót, amit éppen lehúzott. Ha legközelebb próbáljuk installálni és lock fájl is van, akkor nem a composer.json alapján, hanem a lock fájl alapján fog dolgozni és az abban szereplő konkrét verziókat húzza le. Ha többen dolgozunk együtt, akkor emiatt ajánlott a lock fájlt is betolni a verziókövetésbe, mert akkor aki lehúzza azt magánál, azokkal a függőségekkel kapja meg, amikkel mi is dolgoztunk, nem pedig másikkal. Ez élesítésnél is fontos lehet, mert habár ha jól írjuk meg a json fájlt, akkor nem kéne összaakadniuk a verzióknak, jobb a békesség.

#### PHPUnit

Ahhoz, hogy a PHPUnit tudja a dolgát, szükségünk lesz egy XML fájlra, ami autentikusan leírja neki, hogy mégis mi a helyzet.

```
<pre data-language="html"><?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="false"
         syntaxCheck="false">
    <testsuites>
        <testsuite name="Laravel Admin Test Suite">
            <directory>./tests/</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

Na most mit is írtunk ide? Először is a bootstrap fájlnak megadtuk a composer autoloaderét.

Akkor most jöjjön az, hogy létrehozunk az említett projektben egy tests mappát, azon belül pedig egy AdminControllerTest osztályt:

```
<pre data-language="php"><?php

namespace Letscode\Admin\Tests; // ez igazából lényegtelen, lévén nem öröklünk a tesztosztályaink közt, viszont ha igen, akkor fel kell vennünk a composer.json-be.

use Illuminate\Contracts\View\View;
use Letscode\Admin\AdminInterfaceProvider;
use Letscode\Admin\Controllers\AdminController;
use Orchestra\Testbench\TestCase; // a testbench sokban segít csomagok tesztelésében

class AdminControllerTest extends TestCase
{

    protected $controller; // simán a controllert teszteljük majd

    public function setUp() {
        $this->controller = new AdminController(); // a controller példánya
        return parent::setUp(); // ezt MUSZÁJ meglépni, mert különben lőttek annak, ami miatt behúzzuk a testbench-et.
    }

    protected function getPackageProviders($app)
    {
        return [AdminInterfaceProvider::class]; // itt fel kell venni a saját csomagunk providerjeit
    }


    public function testIndexAction() { // itt leteszteljük, hogy az indexaction valóban visszatér-e egy view-val
        $view = $this->controller->index(); 
        $this->assertTrue($view instanceof View); // megnézzük, hogy tényleg azzal tér-e vissza.
    }

}
```

A fenti egy roppant egyszerű teszt. A legfontosabb lépések, hogy az Orchestra\\TestBench\\TestCase osztályt örökítsük le. Adjuk át a saját providerjeinket a getPackageProviders-en át, valamint ha a setUp-ba nyúlunk, mindig hívjuk rá a super-t.

Akkor most nézzük, hogy mit is eredményez, ha a gyökérben futtatunk egy phpunit-ot?

```
Testing started at 22:10 ...
PHPUnit 3.7.21 by Sebastian Bergmann.
Configuration read from C:\temp\lara-admin\phpunit.xml
Time: 0 seconds, Memory: 5.75Mb
OK (1 test, 1 assertion)
```

Amit nem látunk az az, hogy 0-ás exit code-al tért vissza a drága. Ha csecsre futnak a tesztek, akkor mindenképp 0-tól eltérő kóddal zárja a futását. Na most akkor tegyük fel a dolgokat a helyükre. A fenti phpunit.xml-t commitoljuk be. A build masinán lennie kell phpunit-nak, amiről azt feltételezzük, hogy a $PATH-ban fel van véve. A telepítésről [itt](https://phpunit.de/getting-started.html). Ez igaz a php-re is, ami a linthez kell majd. Valamint szükség lesz a [composerre ](https://getcomposer.org/doc/00-intro.md#globally)is. Ha ezek megvannak, akkor mehet a menet!

Na jó, az igazat megvallva szükség lesz még egy dologra, mégpedig egy jól szituált build.xml-re, valamint egy ant-ra (linuxosok előnyben), amivel buildelni fogjuk a cuccot.

A build.xml a következőképp mutat:

```
<pre data-language="html"><?xml version="1.0" encoding="UTF-8"?>
<project name="lara-admin" default="quick-build">
    <property name="phpunit" value="phpunit"/>
    <target name="quick-build"
            depends="lint,composer,phpunit"
            description="Performs a lint check get dependencies and runs the tests"/>

    <target name="composer" unless="composer.done" description="Get dependencies to run tests">
        <exec executable="composer" failonerror="true">
            <arg value="install"/>
        </exec>
        <property name="composer.done" value="true"/>
    </target>

    <target name="lint"
            unless="lint.done"
            description="Perform syntax check of sourcecode files">
        <apply executable="php" taskname="lint">
            <arg value="-l" />

            <fileset dir="${basedir}/src">
                <include name="**/*.php" />
                <modified />
            </fileset>

            <fileset dir="${basedir}/tests">
                <include name="**/*.php" />
                <modified />
            </fileset>
        </apply>

        <property name="lint.done" value="true"/>
    </target>

    <target name="phpunit"
            unless="phpunit.done"
            description="Run unit tests with PHPUnit">
        <exec executable="${phpunit}" failonerror="true" resultproperty="result.phpunit" taskname="phpunit">
            <arg value="--configuration"/>
            <arg path="${basedir}/phpunit.xml"/>
        </exec>

        <property name="phpunit.done" value="true"/>
    </target>

    <target name="-check-failure">
        <fail message="PHPUnit did not finish successfully">
            <condition>
                <not>
                    <equals arg1="${result.phpunit}" arg2="0"/>
                </not>
            </condition>
        </fail>
    </target>
</project>
```

Na most a fenti fájl kissé bonyolultnak hathat elsőre, de közel sem az. Fel van véve benne háromféle feladat, amiket szép sorban végrehajt a program. Először lefut a lint, az src és a tests mappában lévő php fájlokat végignyálazza syntax errorra vadászva. Ha ez megvolt, utána meghívja a composer install parancsot, amivel leszedi a függőségeket, ezután pedig az imént szerkesztett phpunit.xml alapján lefuttatja a teszteket. Ha bármelyik feladat hibára fut (azaz 0-tól eltérő exit code-al zárul), akkor a build-et sikertelennek jelöli.[![formica](assets/uploads/2016/02/formica.jpg)](assets/uploads/2016/02/formica.jpg)

A fenti build.xml fájlt is commitoljuk be, és toljuk fel repoba őket. Ezután nyissuk meg a jenkins jobunk beállításait és vegyük fel az Antot (Invoke Ant), mint a build egyik eleme. Nyissuk le a haladó nézetet és állítsuk be build fájlnak a build.xml-t. [![jenkins](assets/uploads/2016/02/jenkins.png)](assets/uploads/2016/02/jenkins.png)Akkor most mentsük el a feladatot és a kinti menüben nyomjunk rá az "Építés most"-ra. Ha mindent jól csináltunk, ezúttal a build el fog tartani egy darabig. A bal oldali listából megint nézzünk rá a logra.

Láthatjuk, ahogy kicheckoutolja, lefut a php lint, leellenőrzi a fájlokat syntax error után kutatva, ha ezzel végzett, a composer leszedi a csomagfüggőségeket, ezután pedig a phpunit lecsekkolja azt az egy tesztünket és a végén:

```
<pre class="console-output"><span class="ant-outcome-success">BUILD SUCCESSFUL
</span>Total time: 1 minute 8 seconds
Finished: SUCCESS
```

Most hirtelen ennyire futotta. A konkrét teszt dolgokba azért nem mentem most bele részleteiben, mert akkor ki jönne el 24.-én meghallgatni élőben? A következő részben jön a SonarQube féle kódanalízis, meg szóba kerülhet hogy is küldjünk erről a buildről értesítést Slacken, netán e-mailben.