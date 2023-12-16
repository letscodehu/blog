---
id: 1578
title: 'Logfájlok pokla 2. &#8211; MDC keretrendszer alatt'
date: '2017-05-13T18:03:10+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/admin/?p=1578'
permalink: /2017/05/13/logfajlok-pokla-2-mdc-keretrendszer-alatt/
tie_post_bg:
    - ''
tie_post_color:
    - ''
tie_gallery_style:
    - slider
tie_link_url:
    - ''
tie_link_desc:
    - ''
tie_video_url:
    - ''
tie_embed_code:
    - ''
tie_audio_mp3:
    - ''
tie_audio_m4a:
    - ''
tie_audio_oga:
    - ''
tie_audio_soundcloud:
    - ''
tie_quote_author:
    - ''
tie_quote_link:
    - ''
tie_quote_text:
    - ''
tie_status_facebook:
    - ''
tie_status_twitter:
    - ''
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2017/05/09213655/red-oak-log-2-scaled-e1578605838303.jpg'
categories:
    - Laravel
    - PHP
tags:
    - apache
    - laravel
    - log4php
    - logging
    - mdc
---

Az előző [cikkben ]({{ site.url }}/2017/05/11/mit-tegyunk-ha-mar-elvesztunk-logfajlokban/)arról volt szó, hogy is tudjuk elszeparálni az egyes logbejegyzéseket az apache loggerével. Mint kiderült, van hasonló funkcionalitás a monologban is, csak ott még nem volt ekkora ráhatása Martin Fowlernek és társainak, mert nem MDC néven, hanem processor néven tudunk belenyúlni és plusz információkkal kiegészíteni az egyes bejegyzéseket. Első körben a Laravelt fogjuk megvizsgálni ezen szempontból, mégpedig az 5.4-es verzióját.

[![](assets/uploads/2017/05/red-oak-log-2-1024x685.jpg)](assets/uploads/2017/05/red-oak-log-2.jpg) Az iménti monologos dolog után persze használhatnánk azt is, de abból a szempontból is tanulságos lehet a cikk, hogy mennyire könnyű vagy épp nehéz kicserélni egy ilyen dolgot. Telepítsük először a Laravelt egy mappába:

```
composer create-project laravel/laravel "5.4"
```

ezután navigáljunk bele és jöhet a logger is a helyére:

```
composer require apache/log4php : "^2.3"
```

Most, hogy megvannak a dolgok, akkor jöhet az, hogy bekonfiguráljuk a LoggerMDC-t. De mégis hol tegyünk ilyet? Mivel nem egy külön csomagban akarjuk ezt megvalósítani, ezért jelen esetben kerüljön az AppServiceProvider boot metódusába:

```
class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        \Logger::configure("config/logger.php");
        $logger = \Logger::getLogger("main");
        Log::swap($logger);
    }
```

Na akkor most [![](assets/uploads/2017/05/Alljunk_meg_egy_szora.png)  ](assets/uploads/2017/05/Alljunk_meg_egy_szora.png)

A bootstrap során a következők történnek. Először is megadjuk a konfiguráció helyét az apache loggerének. Ezt a Laravel által már megszokott helyre tettük, a `config` mappába, mindjárt megnézzük a tartalmát is. Ha ez megtörtént, akkor a statikus factory-ból kikérünk egy logger példányt. Ezután jön az igazi mágia, amikor azt mondjuk a Log facade-nek, hogy ugyan cserélje már ki a facade mögött található objektumot arra, amit átadunk. Ez elég veszélyes játszma, ugyanis nincs rá garancia, hogy ami objektumot átadunk, az képes lesz ellátni azt a feladatot, mint amire hivatott, lévén semmiféle típusellenőrzés nincs, nem kell interfészeknek megfelelnünk, se semmi, ugyanis mindenféle `call` és `callStatic`-ekkel kerül megoldásra mindez. Viszont az igen nagy szerencse ebben az esetben, hogy a két logger, a monolog és a log4php közel ugyanolyan metódusokkal van felvértezve, ezért a kódunkat nem nagyon tudjuk megfektetni, habár ez a megoldás közel sem szép. Most akkor nézzük meg a konfigurációt:

```
return array(
    'appenders' => array(
        'default' => array(
            'class' => 'LoggerAppenderFile',
            'layout' => array(
                'class' => 'LoggerLayoutPattern',
                'params' => array(
                    'conversionPattern' => '%date [%logger] [%-5level] [%mdc{guid}] %msg%n'
                )
            ),
            'params' => array(
                'file' => 'storage/logs/laravel.log',
                'append' => true
            ),
        ),
    ),
    'rootLogger' => array(
        'appenders' => array('default'),
    )
);
```

Nagyban hasonlít az előző cikkben írtakhoz, a fájl elérési útját leszámítva, amit ugyanis a laravel default logjához állítottunk be, hogy ez ne változzon. Akkor most jön az, hogy hol kellene az MDC értékét beálítani? Nos ezt egy middlewareben kellene megejtenünk, úgyhogy hozzunk is léttre egy UserAware middleware-t erre a célra. Ez annyit fog csinálni, hogy a sütik közül a guid-ot kiszedi és beállítja az MDC-k közé.

```
public function handle($request, \Closure $next)
{

    \LoggerMDC::put("guid",$request->cookie("laravel_session"));

    return $next($request);
}
```

Az egyszerűség kedvéért most a laravel session értékét fogjuk használni, így nem kell külön sütit létrehoznunk és beállítgatnunk. Akkor már csak egy olyan route kell, ahol használjuk ezt a middleware-t. Vegyük fel a web-es middleware groupba mindezt a `app/Http/Kernel.php` - ban:

```
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
        UserAware::class
    ],
```

Ezután minden `routes/web.php`-ben létrehozott route-ra érvényes lesz ez a middleware is, így nincs más dolgunk, mint a gyári welcome page-et kiegészíteni:

```
Route::get('/', function () {
    Log::info("teszt");
    return view('welcome');
});
```

Ezután ha meglőjük a főoldalt, már láthatjuk is a logbejegyzéseket:

```
2017-05-12T22:01:42+00:00 [main] [INFO] [WTWlh1oaFTpSO0tFzCMScpYZNkgtlQ8fKxPOeygk] teszt
```

Nem is volt olyan nehéz, ugye? Viszont a megoldás továbbra sem szép, de annak érdekében, hogy generikus megoldást hozzunk a rendszerbe (ezáltal a kivételek is ezzel legyenek logolva), ami pl. képes az exception-ök kezelésére is, sajnos le kell cseréljük a loggert. Viszont mágia ide vagy oda, a nap végén nekünk adott egy [Logger](https://github.com/apache/logging-log4php/blob/master/src/main/php/Logger.php) osztályunk, amire rá akarunk húzni egy [LoggerInterface](https://github.com/php-fig/log/blob/master/Psr/Log/LoggerInterface.php)-t. A Log facade az alábbi statikus metódusokkal rendelkezik, amiket egy az egyben delegál az elburkolt osztály nem-statikus metódusainak:

```
 Log::emergency($message);
 Log::alert($message);
 Log::critical($message);
 Log::error($message);
 Log::warning($message);
 Log::notice($message);
 Log::info($message);
 Log::debug($message);
```

Tehát egy az egyben megfelel a PSR LoggerInterface-nek. Sajnos az apache loggere nem felel meg ennek az interfésznek, úgyhogy valamit tennünk kell. Ha nem hisszük el, próbáljuk ki az emergency metódust:

```
Route::get('/', function () {
    Log::emergency("teszt");
    return view('welcome');
});
```

Bizony, csúnyán elszáll a dolog:

```
2017-05-13T10:39:42+00:00 [main] [ERROR] [] Symfony\Component\Debug\Exception\FatalThrowableError: Call to undefined method Logger::emergency()
```

Mondjuk az dícséretes, hogy az errort ugyanúgy kilogoltuk 🙂

Mi is volt az a tervezési minta, ami két nem kompatibilis interfész áthidalására szolgált? Bizony, ez az [adapter]({{ site.url }}/2015/01/29/tervezesi-mintak-adapter-pattern/) lesz, ami erősen [decorator]({{ site.url }}/2016/04/28/diszitsuk-fel-wrappert/) szagú is! Mivel nincs konkrét megfeleltetés, amikor swapeljük az facade mögötti objektumot, ezért létrehozunk egy adaptert, ami implementálja a LoggerInterface-t és ennek a publikus metódusait mappeljük át az apache loggerére. Most erre külön csomagot fogunk létrehozni, de az lenne a legjobb megoldás, ha már valaki létrehozott volna és azt használnánk, de abban nem lenne semmi izgalmas 🙂

Akkor keressünk egy megfelelő helyet erre és hozzunk létre egy szép composer.json-t:

```
{
    "name": "letscodehu/monolog-log4php-bridge",
    "require": {
        "apache/log4php" : "2.3",
        "psr/log" : "^1.0"
    },
    "autoload" : {
      "psr-4" : {
       "Letscodehu\\" : "src/"
      }
    },
    "authors": [
        {
            "name": "Papp Krisztián",
            "email": "fejlesztes@letscode.hu"
        }
    ],
    "require-dev": {
    "phpunit/phpunit": "^6.1"
    }
}
```

Szükségünk lesz az apache loggerére, valamint a PSR szabvány interfészekre, amit implementál a monolog is. Szükségünk lesz még a PHPUnitra, hogy néhány egyszerű teszttel lefedjük azt. Belőjük az autoloadert az `src` mappára és ezután már csak egy `composer install` kell és minden készen áll, hogy nekilássunk![![](assets/uploads/2017/05/heggesztes-4n.jpg)](assets/uploads/2017/05/heggesztes-4n.jpg)

Hozzunk létre egy `LoggerAdapter` osztályt, ami egyelőre csak implementálja a `LoggerInterface`-t, üres metódusokkal:

```
namespace Letscodehu\Logger;


use Psr\Log\LoggerInterface;

/**
 * Adapter class for wrapping Apache loggers to a PSR compliant Logger.
 * @author Krisztian Papp
 */
class LoggerAdapter implements LoggerInterface {

    /**
     * @var \Logger
     */
    private $logger;

    function __construct(\Logger $logger)
    {
        $this->logger = $logger;
    }

    public function emergency($message, array $context = array())
    {
        // TODO: Implement emergency() method.
    }

    public function alert($message, array $context = array())
    {
        // TODO: Implement alert() method.
    }

    public function critical($message, array $context = array())
    {
        // TODO: Implement critical() method.
    }

    public function error($message, array $context = array())
    {
        // TODO: Implement error() method.
    }

    public function warning($message, array $context = array())
    {
        // TODO: Implement warning() method.
    }

    public function notice($message, array $context = array())
    {
        // TODO: Implement notice() method.
    }

    public function info($message, array $context = array())
    {
        // TODO: Implement info() method.
    }

    public function debug($message, array $context = array())
    {
        // TODO: Implement debug() method.
    }

    public function log($level, $message, array $context = array())
    {
        // TODO: Implement log() method.
    }
}
```

Akkor jöjjenek hát a tesztek, mert nem csak vaktában lövöldözni akarunk, ha már itt a legújabb PHPUnit számunkra. Hozzunk létre egy phpunit.xml-t a projekt gyökerében:

```
<?xml version="1.0" encoding="UTF-8"?>
<phpunit backupGlobals="false"
         backupStaticAttributes="false"
         bootstrap="vendor/autoload.php"
         colors="true"
         convertErrorsToExceptions="true"
         convertNoticesToExceptions="true"
         convertWarningsToExceptions="true"
         processIsolation="false"
         stopOnFailure="false">
    <testsuites>
        <testsuite name="Unit Tests">
            <directory suffix="Test.php">./tests</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

Megadjuk neki a testsuite-unk helyét, ahol a `Test.php` végződésű fájlokat fogja nekünk felnyalni. Beállítjuk a composer autoloaderét, mint bootstrap fájl, valamint néhány alapbeállítást elvégzünk.

Ezután létrehozunk egy `LoggerAdapterTest.php`-t a tests mappában:

```
<?php


/**
 * Unit test for LoggerAdapter
 */
class LoggerAdapterTest extends \PHPUnit\Framework\TestCase {

}
```

Akkor most lehet elkezdeni végre kódolni 🙂 Először is jöjjön egy törő teszt, ugye?

A teszt osztályunk setUp metódusába, ami minden teszt előtt lefut, vegyünk fel egy kódrészletet, ami az adapterünket létrehozza egy mock loggerrel:

```
private $mockLogger;
private $underTest;

public function setUp() {
    $this->mockLogger = $this->createMock(Logger::class);
    $this->underTest = new \Letscodehu\Logger\LoggerAdapter($this->mockLogger);
}
```

Ezután jöjjön egy teszt, először az info helyes működésére:

```
/**
 * @test
 */
public function it_should_delegate_info_call() {
    // GIVEN
    $this->mockLogger->expects($this->once())->method("info")->with("test");
    // WHEN
    $this->underTest->info("test");
    // THEN
}
```

A korábban átadott mock-nak most megmondjuk, hogy egyszer meg fogjuk hívni az info metódusát, mégpedig a "test" paraméterrel. Ezután meghívjuk ténylegesen és várjuk, hogy beigazolódjon a dolog. Futtassuk le a teszteket a projekt gyökerében kiadva a

```
vendor/phpunit/phpunit/phpunit
```

parancsot.

```
There was 1 failure:

1) LoggerAdapterTest::it_should_delegate_info
Expectation failed for method name is equal to <string:info> when invoked 1 time(s).
Method was expected to be called 1 times, actually called 0 times.

FAILURES!
Tests: 1, Assertions: 1, Failures: 1.
```

Természetesen failel, mivel még nincs kész az osztályunk. Zöldítsük ki a tesztet akkor!

```
public function info($message, array $context = array())
{
    $this->logger->info($message);
}
```

Ennyivel sikerül is zölddé tenni a tesztet, viszont a gond ott van, hogy van itt egy $context paraméter is. Ez a Laravel defaultok használatával egy JSON encoded stringként jelenik meg, akkor egészítsük ki a tesztünket egy új metódussal:

```
/**
 * @test
 */
public function it_should_delegate_info_with_json_encoded_context() {
    // GIVEN
    $this->mockLogger->expects($this->once())->method("info")->with("test {\"test\":\"test\"}");
    // WHEN
    $this->underTest->info("test", ["test" => "test"]);
    // THEN
}
```

Ez természetesen elszáll, úgyhogy írjuk meg a logikát hozzá:

```
public function info($message, array $context = array())
{
    if (empty($context)) {
        $this->logger->info($message);
    } else {
        $this->logger->info(sprintf("%s %s", $message, json_encode($context)));
    }
}
```

Ezzel a teszt ki is lett zöldítve. Az else ágban levő részt refaktorálhatjuk egy kicsit, mert hasonlóképpen fogunk eljárni az összes loglevel esetében a context tartalmával:

```
public function info($message, array $context = array())
{
    $this->logger->info($this->formatWithContext($message, $context));
}

private function formatWithContext($message, array $context)
{
    if (empty($context)) {
        $formatted = $message;
    } else {
        $formatted = sprintf("%s %s", $message, json_encode($context));
    }
    return $formatted;
}
```

Újrafuttatjuk a teszteket és mivel zöldek maradtak, ezért mehetünk tovább! Most nem fogok minden egyes metódusra kitérni, amiket csak így továbbadunk, hanem azokra térek ki, amik pl. nem léteznek. Ezeket az apache Logger::log metódusán át tudjuk majd elérni, aminek az első paramétere lesz a trükkös számunkra. Ahhoz, hogy új logszintet hozzunk létre, egy meglévőt kell használnunk, ugyanis egy privát konstruktorral meghiúsították azon irányú terveinket, hogy szimplán leörökítsük a `LoggerLevel` osztályt, ennélfogva némileg átmappeljük a dolgokat, így a monolog `emergency` és `critical` loglevelből `fatal`-t alkotunk, a `notice`-ból pedig `info`-t.

A kész csomag, a maga pár fájljával [itt](https://github.com/letscodehu/monolog-log4php-bridge) található. Akkor vissza a Laravelhez! A composer.json-ben fel kell vegyük a repositories közé a github repot, mivel packagist-re nem került ki a dolog:

```
"repositories" : [
  {
    "type" : "vcs",
    "url" : "https://github.com/letscodehu/monolog-log4php-bridge"
  }
],
```

Valamint, mivel már az adaptert akarjuk behúzni, kicserélhetjük az `apache/log4php`-t az adapter csomagjára a `require` szekcióban:

```
"letscodehu/monolog-log4php-bridge" : "1.0.0"
```

Ezután pedig updateljük a projektet:

```
composer update
```

Ezután pedig az AppServiceProviderben írjuk kicsit át a boot-ot:

```
$logger = \Logger::getLogger("main");
$loggerAdapter = new LoggerAdapter($logger);
Log::swap($loggerAdapter);
```

Ezután pedig nézzük meg újra azt az emergency-t, most ráadásként valami context-el:

```
Route::get('/', function () {
    Log::emergency("teszt", ["id" => "teszt"]);
    return view('welcome');
});
```

A logfájlokban pedig:

```
2017-05-13T16:54:18+00:00 [main] [FATAL] [OfrSbJozpkVLZImqNj5LSldGqNMu7n0rsfW4tyJ4] teszt {"id":"teszt"}
```

Tehát sikerült áthidaljuk a problémát, mondjuk nem a legszebb módszerrel. A következő cikkben megnézzük mindezt Symfony és Zend alatt is, és sorra kerül végre a Splunkos keresésre is!