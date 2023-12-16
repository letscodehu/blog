---
id: 946
title: 'Partizánkodjunk a laravel 5-el!'
date: '2016-01-11T23:23:39+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=946'
permalink: /2016/01/11/partizankodjunk-a-laravel-5-el/
dsq_thread_id:
    - '4482777718'
    - '4482777718'
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2016/01/09202020/wvgpy.jpg'
categories:
    - Laravel
    - PHP
tags:
    - artisan
    - command
    - laravel
    - php
    - scaffolding
---

Ismert a mondás, miszerint amit automatizálni lehet, azt automatizálni is kell.

Nincs ez máshogy a programozásban sem, sőt itt kellene kiélni mindezt. Bizonyára mindenki szeret kódolni, jó érzés gőzerővel verni a <del>hackertypert</del>billentyűzetet, mert ilyenkor ha ránknéz a főnök, akkor valóban elhiszi, hogy dolgozunk, nem úgy mikor fejvakarás közepette görgetünk lefelé a Stackoverflow-n.[![wvgpy](assets/uploads/2016/01/wvgpy.jpg)](assets/uploads/2016/01/wvgpy.jpg)

Viszont amit gőzerővel tudunk gépelni, az legtöbbször azért van, mert már a kisujjunkban van az, amit gépelni kell. Ha pedig így van, akkor miért ne adnánk át a tudásunkat egy hozzánk közel állónak, aki történetesen egy program? A Laravel 5 parancssori <del>túlja</del> toolja, a partizán elég sok beépített paranccsal érkezik, amik legtöbbje megkíméli nekünk a hasonló kulimunkát, különböző generátor scriptek által. Pillnyalatok alatt legenerálhatunk controllereket, modelleket, adatbázis sémát, migrálhatunk és még sok másra jó mindez. Cikkünkből megtudhatod, hogy is bővíthetjük azt, hogy az alkalmazásunk frissebb, lágyabb, összességében pedig szárazabb érzést nyújtson.

Ahhoz hogy saját parancsokkal egészítsük ki az artisan parancslistáját, először is fel kell vennünk az ehhez tartozó Command osztályt. Ezek alapesetben az app/console/Command mappába kerülnek (lévén a composer autoloadja segítségünkre siet, igazából bárhova kerülhet, sőt később erre lesz példa, hogy csomagból sütjük el a dolgot) és most hozzuk létre kézzel.. na jó, természetesen erre is van parancsunk. Mivel szeretnénk egyből hozzákapcsolni az osztályunkat egy parancshoz, ezért a --command paraméterrel adjuk ki azt:

```
<pre data-language="shell">php artisan make:console ScaffoldAdmin --command=make:admin
```

Ez legenerál nekünk egy ScaffoldAdmin nevű osztályt a fenti mappába. Elvileg ez nem fog csinálni semmit, de azért próbáljuk ki, hogy működik-e a semmi!

```
<pre data-language="shell">php artisan make:admin
```

Hoppá, itt valami nem megy. Hát persze, hogy nem, mert ahhoz, hogy mindez működjön, be kell regisztráljuk az osztályunkat az app/console/Kernel.php-ba. Mivel generátor scriptekről van szó és elég egyszerűek, ezért nem nyúlnak bele a már meglévő fájlokba (ahogy ehhez kellett volna), hanem csak az új tartalmakat generálják le. Tehát némi kulimunka ránk marad.

Vegyük fel az osztályunkat az app/console/Kernel.php-ba:

```
<pre data-language="php">protected $commands = [
   'App\Console\Commands\ScaffoldAdmin'
];
```

Most, hogy újrapróbáljuk... megint hibára fut, miszerint nincs elég argumentum. Hát mi a ?? Ha megnyitjuk a generált osztályunkat, akkor találunk benne pár metódust, amik közt lesz egy:

```
<pre data-language="php">protected function getArguments()
{
   return [
       ['example', InputArgument::REQUIRED, 'An example argument.'],
   ];
}
```

Áhá! A fenti metódus egy tömbbel tér vissza, amiben szintén egy tömbben vannak az egyes argumentumok megadva.

Az argumentumot szimbolizáló tömb első eleme maga a paraméter, amit be kell írni, a második az egyes módok, harmadik a leírás hozzá, a negyedik elem, ami itt nincs az pedig az alapértelmezett érték.

A mód két értéket vehet fel, az egyik az InputArgument::OPTIONAL, az opcionális, míg a már fent említett pedig a kötelező argumentumokra vonatkozik.

Ehhez hasonlók az opciók, amivel szintén testre tudjuk szabni a parancsunkat. Ezeket a getOptions() metódusban kell az argumentumokhoz hasonlóan egy nested tömbben visszaadnunk, viszont itt némileg más a felépítése egy-egy elemnek.

Az első elem szintén a név, amit a -- után kell majd írni ( pl. --provider=), a második a rövidítés, ami értelemszerűen egy rövidebb elnevezés, sima kötőjelet követve (pl. -p=). A harmadik elem a mód lesz, itt szintén előfordulhat a már említett OPTIONAL és REQUIRED, viszont jön még a VALUE\_NONE, az olyan esetekben, mikor nem LEHET értéket megadni (tehát nem olyan, mint a mysql -p paramétere.), tehát egy szimpla kapcsoló. Valamint a VALUE\_IS\_ARRAY, amikor az opciót többször is meg lehet adni, pl.:

```
php artisan my:command --opcioneve=1 --opcioneve=2
```

A fentieket követik a leírás és a default érték, az argumentumokhoz hasonlóan. Természetesen lesz lehetőségünk interaktívan bekérni adatokat és kiírni ezt-azt a képernyőre, nem kell kétségbe esni, hiszen lehet komplex feladatokat is ellátni, amiket parancssori argumentumokkel konfigurálni elég nehéz lenne.

A command futásakor a fire metódus hívódik meg rajta (ugye emlékszünk még a [command patternre]({{ site.url }}/2015/08/30/command-pattern-es-a-penzugyszamvitel/)? 🙂 ), így a logika majd ebben lesz.

Csináljunk is valamit, ha már itt vagyunk, szóval akkor szedjük elő a jól szituált commandunkat és írjunk bele valami egyszerűt. Elsőként szedjük ki a belegenerált argumentumot/optiont a fent említett tömbökből, utána pedig írjunk ki valami tutiságot a konzolra.

```
<pre data-language="php">namespace App\Console\Commands;

use Illuminate\Console\Command;

class ScaffoldAdmin extends Command {

   /**
    * The console command name.
    *
    * @var string
    */
   protected $name = 'make:admin'; // a parancs, amit a php artisan után kell írni

   /**
    * The console command description.
    *
    * @var string
    */
   protected $description = 'Command description.';

   /**
    * Create a new command instance.
    *
    * @return void
    */
   public function __construct()
   {
      parent::__construct();
   }

   /**
    * Execute the console command.
    *
    * @return mixed
    */
   public function fire()
   {
      $this->info("I had a problem and I used Java. Now I have a problemfactory..."); // a $this contextben elég sok parancs lesz interakciókra és hasonlókra. Az info kiírja a paraméterként átadott stringet
   }

   /**
    * Get the console command arguments.
    *
    * @return array
    */
   protected function getArguments()
   {
      return [
         // ahogy argumentumot sem
      ];
   }

   /**
    * Get the console command options.
    *
    * @return array
    */
   protected function getOptions()
   {
      return [
           // nem szükséges opciót megadjunk
      ];
   }

}
```

Ha most beírjuk a konzolba a következőt:

```
<pre data-language="shell">php artisan make:admin
```

Akkor kiírja az infoban átadott szöveget és bumm, eddig tartott. Ha már paramétereket nem adunk át, akkor kicsit játszadozzunk szegény felhasználóval. A fire metódus tartalmát cseréljük ki a következőre:

```
<pre data-language="php">$fish = $this->ask("How much is the fish?", 0); // az ask metódus első paramétere a kérdés, a második pedig a default value, visszatérési értéke pedig a felhasználó által megadott válasz
$this->info("Yeah! (and the fish was $fish)"); // amit itt bele is fűzünk a válaszba
```

Ennyire egyszerűen tudunk adatokat bekérni, de mi a helyzet ha csak jóváhagyni szeretnénk valamit, mi a helyzet az eldöntendő kérdésekkel?

```
<pre data-language="php">if ($this->confirm("Is it OK if we format your hard disk? [y/n]", true)) { // a confirm metódus első paramétere szintén a kérdés string, a második pedig a default value.
   $this->info("That's the spirit man!");
} else {
   $this->error("That's just sad."); // az error/question/info/comment metódusok mindegyike kimenetet ad a konzolra, a megfelelő ANSI színekkel persze
}
```

Hogy ne kelljen egy böszme commandot összeférceljünk, ezért a már megírt parancsok egy call metódussal hívhatóak:

```
<pre class=" language-php">$this->call('parancs:neve', ['argumentum' => 'ertek', '--opcio' => 'ertek']);
```

Ezáltal csinálhatunk több kisebb parancsot (vagy használhatjuk másét) és a végén ezt összefoghatjuk egy saját komplexebb feladatot ellátó parancsban.

Na de ne ugorjunk ennyire a mélyvízbe...[![crossing_street_hand_up](assets/uploads/2016/01/crossing_street_hand_up.jpg)](assets/uploads/2016/01/crossing_street_hand_up.jpg)

.. vagy mégis, mert abból tanulunk, ugyebár?

Szóval mi lenne, ha elkészítenénk egy egyszerű bejelentkezéssel és user management-el megáldott, lehetőleg könnyen bővíthető admin felületet, mindezt composer package-ként és artisan parancsokkal rendre tudnánk utasítani, hogy miket és hogy is generáljon le, hogy pár gombnyomásra beröffenthető legyen? Nanana? Ám legyen!

Akkor nézzük meg, hogy mindezt hogy is képzeljük el és hogy valósítható meg mindez Laravellel?

Tehát azt szeretnénk, hogy beírjuk azt a bizonyos php artisan make:admin parancsot és legenerálja az egészet. Persze jó volna testreszabni mindezt, nem? Akkor bizony kellenek paraméterek. Elég lesz ez nekünk? Kérdéses, mert mi bizony több dolgot be akarunk állítani, nemde?

Vegyük sorra őket:

- Milyen route-on legyen elérhető az adott admin. Itt természetesen route group-ra gondolunk, tehát /admin, <del>/lofasz</del>, /Admin, /manage, stb.
- Mi legyen az adatbázis, tábla neve, ahol a user adatokat tároljuk?
- Fel kéne venni egy superadmin-t is, nemde? Akkor az ő belépési adatait se ártana megadni.
- Szeretnénk fragmentálni a dolgot, ezért több parancsot hozunk létre, melyek akár hívhatják egymást is.

Egyelőre ennyi, ha útközben eszünkbe jut más is, akkor majd úgyis belepatkoljuk. Azonban már ez is elég sok, hogy paraméterként mindet átadjuk, így jobb lesz a fenti ask metódust használni.

> Mivel ez nem egy apró feladat, ezért több részen át kell majd taglaljam, mindegyik egy kicsit más részre fog fókuszálni, a vendor:publish-tól a Jenkins builden át, egészen SonarQube adatainak elemzéséig.

Viszont a legelső dolog egy [composer ]({{ site.url }}/2015/03/12/composer-a-php-fejlesztok-kedvenc-zeneszerzoje/)csomag létrehozása lesz, amibe a mi kis adminunkat belepakoljuk, így ha jól sikerül, bárhol máshol használhatjuk, bővíthetjük azt. Lévén nem publikus helyen lesz, ezért nem árt neki egy repository ( akinek a verziókövetés homályos [az itt]({{ site.url }}/2015/02/22/a-git-tegylet/) keresgélhet).

Legközelebb mindenkit várok egy kis composeresdire!