---
id: 1196
title: 'Cross-Platform mobilosodás &#8211; 1. rész'
date: '2016-07-23T19:07:09+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1196'
permalink: /2016/07/23/cross-platform-mobilosodas-1-resz/
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
image: 'assets/uploads/2016/07/09202158/kingscross-scaled.jpg'
categories:
    - Frontend
    - JavaScript
tags:
    - angular
    - cordova
    - 'cross platform'
    - html5
    - ionic
    - javascript
    - mobile
---

Vannak dolgok, amik univerzálisak. Ilyen pl. a nevében is magában rejtő USB, az univerzális soros busz. Viszont nagyon sok esetben azt látjuk, hogy mindenki a saját kis dolgait erőlteti és emiatt adapterek, átalakítók tömkelegét cipeljük mindenfelé magunkkal. Ugyanez a helyzet a számítógépünkkel, kinek a Linux, kinek a Mac, na meg a Windows. Az okostelefonok megjelenésekor a nagyobb cégek ugyanúgy ráraboltak a piacra, de a helyzet mit sem változott: Android, iOS, Windows Phone. A fejlesztőcégek szempontjából ez nem sok jót jelentett, mert ha valaki ki akart jönni egy mobilapplikációval és minél nagyobb piacot szeretett volna lefedni, akkor bizony gondoskodnia kellett az egyes platformokra szakosodott mobilfejlesztőkről, ha szerveroldal is volt, akkor ez már a legkisebb projekt esetében is 4 embert jelentett. Persze a projektek általában nem ilyen aprók, a fejlesztők pedig nem olcsók, így többek fejéből is kipattant, hogy is lehetne ezt a számot lecsökkenteni?

[![kingscross](assets/uploads/2016/07/kingscross-1024x683.jpg)](assets/uploads/2016/07/kingscross.jpg)[  ](assets/uploads/2016/07/crossplatform.png)

Az egyik ilyen megközelítés a Xamarin, ami az eredetileg C#-ban megírt kódot fogja átalakítani az adott platform kódjára, ennélfogva natív applikációt generál. A másik ilyen megközelítés pedig az Apache Cordova. Ez utóbbi ötlete onnan jött, hogy minden okostelefonban található egy, a platformra jellemző böngésző és <del>a frontendesek úgyis szerettek szopni az IE kompatibilitással</del> mi lenne, ha mi igazából ezt a böngészőt használnánk fel és aztán a frontendesünket tudnánk ezzel újrahasznosítani a mobilpiacon is? Mondanom sem kell, hogy rengetegen ugrottak erre az ötletre, hogy a HTML5/CSS/JS tudással már rendelkező webes kollégákat ráuszítsák a mobilfejlesztésre. Ezek az applikációk, természetükből adódóan nem feltétlenül lesznek olyan jók performance tekintetben, mint natív társaik, az eszközzel is egy API-n és plugineken keresztül tudunk kommunikálni, ennélfogva korlátoltabb a hozzáférésünk, de valamit valamiért. Cikksorozatunkban létrehozunk egy [Wunderlistre](https://en.wikipedia.org/wiki/Wunderlist) hajazó egyszer

to-do list cross platform hibrid mobilapplikációt, a [Cordova](https://cordova.apache.org/) alapokra épülő [Ionic](http://ionicframework.com/) frontend keretrendszer segítségével, a szerveroldali kiszolgálását egy[ Zend Expressive](https://framework.zend.com/blog/announcing-expressive.html)-ben létrehozott REST API fogja ellátni.

Az első lépés a tervezés lenne, de lévén a cél a technológiák bemutatása, ezért inkább ezzel kezdem, lépésről lépesre.

### Ionic framework

[![ionic](assets/uploads/2016/07/ionic.png)](assets/uploads/2016/07/ionic.png)

Az Ionic egy frontend keretrendszer, ami Cordován és AngularJS-en alapszik és egyik legfőbb előnye, hogy rengeteg, a mobilokban jelenlevő komponens testreszabható és már kész is van benne, mindezt úgy, hogy habár egyszer írjuk meg, mindig az aktuális platform külsejét idézi. Ahhoz, hogy ezzel el tudjunk kezdeni foglalkozni, szükségünk lesz egy [Node.js](https://nodejs.org/en/)-re. Ha ezt leszedtük, akkor jött vele az npm is, így már telepíthetjük a cordovát:

```
<pre data-language="shell">$ sudo npm install -g cordova
```

utána pedig az ionicot:

> A -g kapcsolóval elérjük, hogy globálisan telepíti a csomagot, így bárhonnan elérhetjük azt

```
<pre data-language="shell">$ sudo npm install -g ionic
```

Most, hogy az npm-en át lerántottuk a fél internetet, lássunk is valamit, nemde?

> Windows alatt értelemszerűen a sudo kimarad

Az ionicnak szerencsére igen jó CLI toolja van, amivel többek között tudunk projetket is létrehozni. Hozzuk hát létre!

```
<pre data-language="php">$ ionic start todoList
```

Letölti githubról a becsomagolt skeleton projektet, inicializálja benne a cordova projektet és még mesél is arról, hogy tudjuk beröffenteni a dolgot. Ha kérdezi, nem akarunk ionic.io accountot létrehozni még. Most, hogy létrehoztuk, navigáljunk bele a könyvátrba és nézzük meg mit is csináltunk:

```
<pre data-language="shell">$ cd todoList
$ ionic serve
```

Ha mindent jól csináltunk és a 8100-as portunk is nyitva, akkor a böngészőnkben megnyílik a localhost:8100, ami így első ránézésre nem tűnik kósernek, lévén dekstop méretben látjuk a dolgot. Akkor most kapjuk elő a devtools-t és nézzük meg mi történik, ha a bekapcsoljuk a mobilnézetet, majd frissítsük az oldalt, hogy a user-agent-et újraküldje a böngésző. Hoppá! Így mindjárt más. Nézzük meg, hogy változnak a dolgok, ha pl. Iphone-t emulálunk és milyen, ha valamilyen Androidos készüléket. Az egyes komponensek kinézetét a háttérben lekezeli az applikáció, hogy a user által elvárt élményt nyújtsa. Ezt JS végzi, de csak a serve alatt. Amikor az alkalmazást lebuildeljük, akkor a megfelelő class-al már a build során ellátja a body elementet, így nem kell várni a JS-ekre, hogy a user-agentből kitalálja melyik stílus is kell épp.

De most másszunk bele a forráskódba és nézzük meg mit is találunk itt?

A könyvtárszerkezet ugyanaz, mint amit a cordova is használ:

- **hooks** : A build folyamat és az egyes parancsok különböző szakaszainál (előtte/utána) tudunk beavatkozni. Az Ionic alapból elhelyez itt egy script-et, ami az imént említett platform specifikus class-t elhelyezi a body tag-en. A cordova egyes hookjairól [itt](https://cordova.apache.org/docs/en/latest/guide/appdev/hooks/) lehet olvasni.
- **plugins**: A cordova alapból kevés dolgot tud, de az adott platform nyelvén írt plugineken keresztül bővíthető és az adott platform lehetőségeit így tudjuk igazán kihasználni. Az Ionic alapból pár plugint le is ránt, de ezekre majd még visszatérünk.
- **scss**: Az scss fájlok, amikből a css-t fordítja nekünk az Ionic. Itt igazából csak egy include van, a tényleges CSS-ek máshol lesznek.
- **www**: A nevéből is kitalálható, hogy a weblapunk tartalma ide kerül majd. Ez a content lesz beégetve az applikációba.
- **config.xml** : A cordova projektet leíró XML fájl. Az applikációnkról itt adhatunk leírást, verziószámot, az ikont itt lehet meghatározni és még sok [mást](https://cordova.apache.org/docs/en/latest/config_ref/index.html).
- **gulpfile.js:** A gulp taskmanagerünknek szóló feladatokat leíró fájl. Azokat a bizonyos css-eket tudjuk ezzel leforgatni, vagy egy watchert csinálni, hogy az scss mappában lévő változások esetén újraforgassa azokat.
- **ionic.project:** A projekt ionic specifikus leírója.

Ezen felül még a gyökérben találhatunk bower és npm specifikus csomagleírókat és .gitignore-t. Na de akit webről szalajtottak az rögtön a www mappában köt ki, így nézzük ott mit is találunk?

```
<pre data-language="html"><link href="lib/ionic/css/ionic.css" rel="stylesheet">
<link href="css/style.css" rel="stylesheet">
```

Itt húzzuk be az ionic saját css-ét, a style.css pedig a sajátunk lesz értelemszerűen.

```
<pre data-language="html"><script src="lib/ionic/js/ionic.bundle.js"></script>

<!-- cordova script (this will be a 404 during development) -->
<script src="cordova.js"></script>
```

A fenti JS húzza be az ionic és az angular, angular-ui,angular-sanitize, angular-animate, angular-resource csomagok összefűzött verzióját, az alsó pedig a cordova API eléréshez szolgáló javascript fájl, ami a serve esetében 404-et dob, mivel csak a build folyamat során kerül a helyére, emiatt ne aggódjunk, ha 404-et látunk a fejlesztés közben böngészőből.

```
<pre data-language="html"><script src="js/app.js"></script>
<script src="js/controllers.js"></script>
<script src="js/services.js"></script>
```

A fentiek már az általunk behúzott javascriptek lesznek, amik most a skeletont alkotják, ezekre is mindjárt kitérünk. A lényeg viszont ezután jön, az angular szüzeknek biztos idegen lesz:

```
<pre data-language="html"><body ng-app="starter">
  <ion-nav-bar class="bar-stable">
    <ion-nav-back-button>
    </ion-nav-back-button>
  </ion-nav-bar>
  <ion-nav-view></ion-nav-view>
</body>
```

A body tag-en található ng-app attribútum fogja beröffenteni a mi applikációnkat. AngularJS-ben kétféleképp lehet bootstrap-elni egy alkalmazást. Az egyik módszer amikor attribútumot helyezünk el a tag-en, amin belül dolgozunk, a másik eset pedig amikor JS kódból tesszük azt. Itt szóltunk, hogy a starter nevű app-ot hozzá akarjuk kötni ehhez a body elementhez.

Az ion-nav-bar és a többi idegen tag ún. direktíva, amikhez valamiféle működést tudunk kötni. Amikor valamit szeretnénk hozzákötni egy adott HTML szekcióhoz, akkor ilyen (vagy attribútum) direktívákkal tudjuk megjelölni azt. Az angular kikeresi az idetartozó direktívát, amit írtunk és magic happens. Van pár beépített direktíva, mint pl. az ngRepeat (kb foreach), ngApp, stb. Fontos megjegyezni, hogy az elnevezéskor camelcase, viszont a HTML-ben mindez már kötőjelekkel elválasztott lesz, az ide-oda konvertálást a háttérben majd elvégzi a rendszer. Szóval itt előkapjuk az ionNavBar direktívát és az majd egy template-et fog behelyettesíteni a helyére. Ugyanez igaz az ionNavBackButton-ra és az ionNavView-re is.

[![jackie](assets/uploads/2016/07/jackie.jpg)](assets/uploads/2016/07/jackie.jpg)

Ez most lehet kicsit sok, de szép lassan megvilágosodunk. Nézzünk bele az app.js-be!

```
<pre data-language="javascript">angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
```

Mivel behúztuk az angular-t, ezért elérhető a globális névtérben az angular nevű objektum. Az angularnak van egy ún. moduel API-ja, azt használjuk mi is itt. Az első paraméter a modul neve lesz, amivel később tudunk erre hivatkozni. A második paraméter pedig egy tömb, amin keresztül a többi hasonlóképpen deklarált modulra hivatkozunk, mint függőségünk.Az ionic modult az ionic.bundle.js-ben deklarálták, a másik kettő pedig erre a starter appra specifikus. Ez a metódus visszaadja a modult, amit kértünk, most nézzük mit csinálunk még vele:

```
<pre data-language="javascript">.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
```

A következő lépés hogy a már felépített modult beröffentjük a run metódussal. Ennek a metódusnak átadjuk a már korábban az ionic által létrehozott $ionicPlatform objektumot. Itt feliratkozunk a ready eventjére, ahogy azt már jQuery-nél a $(document).ready-nél láttuk. Azután megnézzük, hogy a cordova be van-e töltve, vannak-e pluginek és a pluginek közt találjuk-e a keyboard plugint. Ha ezeknek a feltételeknek megfelelünk, akkor jön egy kis mágia, mert a telefonok natív billentyűzete megborította a UI-t és erre létrehoztak egy plugint, így nem csúszik semmi össze. Ezt ne szedjük ki semmiképp 🙂 Ezután pedig a Statusbarral történik hasonló.

Ezután következik a configurációs szekció. Az Ionic az egyes projektek létrehozásakor templateket használ, amiből a default, lévén mi nem írtuk azt felül az ún. tabs-template volt, ami pár fülön fog tartalmat megjeleníteni.

> Ha más template-et akarsz használni, akkor az ionic start projektNeve \[templateNeve\] szintaxist használd.

```
<pre data-language="javascript">.config(function($stateProvider, $urlRouterProvider) {
```

Itt beinjektálásra kerül a bundle-ben definiált két service, a $stateProvider és a $urlRouterProvider.

> AngularJS-ben az egyes service-ek nevét $-al prefixáljuk

A konfigurációban ezután meghatározunk ún. state-eket. Az Ionic az Angular-UI routerét haszálja, ami ezek alapján a state-ek alapján különböző controllereket hív meg. Ezt a state-et képzeljük el egyfajta route-ként.

```
<pre data-language="javascript">$stateProvider

// setup an abstract state for the tabs directive
  .state('tab', {
  url: '/tab',
  abstract: true,
  templateUrl: 'templates/tabs.html'
})
```

A fentiekben létrehozunk egy ún. absztrakt state-et 'tab' névvel, amit aztán a többi tab nézetben fel tudunk használni konténerként. Meghatározzuk az URL-t amire mutat majd, valamint egy template elérési utat, ahonnan ő betölti a rá vonatkozó HTML-t, az abban levő direktívákat szintén feldolgozza és megjeleníti.

```
<pre data-language="javascript">.state('tab.dash', {
  url: '/dash',
  views: {
    'tab-dash': {
      templateUrl: 'templates/tab-dash.html',
      controller: 'DashCtrl'
    }
  }
})
```

Na itt már egy fokkal több minden van. Láthatjuk, hogy tab-al prefixált, tehát az imént létrehozott abstract view-ba fog beágyazódni ez a state. A views kulcson látjuk, hogy létrehoztunk egy tab-dash view-t, aminek meg van határozva a template elérési útja és az őt kiszolgáló kontroller. Ez ismétlődik a fájlban, ahogy az egyes tabokhoz hozzárendeljük a felelős controllereket és template-ket. A végén látható:

```
<pre data-language="javascript">$urlRouterProvider.otherwise('/tab/dash');
```

pedig azért felelős, hogyha a deklarált URL-ek közül egyikre sem illik a meghívott, akkor ide (a dashboardra) "redirektál", mint default. Amikor szimplán meghívódik az app, akkor is ez történik, hiszen a '/' nem illik egyikre sem. Na, akkor nézzük csak meg ezeket a templateket és rakjuk össze, hogy mi is történik itt a háttérben feketemágia címszó alatt. Kezdjük a tabs.html-el:

```
<pre data-language="html"><ion-tabs class="tabs-icon-top tabs-color-active-positive">

  <!-- Dashboard Tab -->
  <ion-tab title="Status" icon-off="ion-ios-pulse" icon-on="ion-ios-pulse-strong" href="#/tab/dash">
    <ion-nav-view name="tab-dash"></ion-nav-view>
  </ion-tab>

  <!-- Chats Tab -->
  <ion-tab title="Chats" icon-off="ion-ios-chatboxes-outline" icon-on="ion-ios-chatboxes" href="#/tab/chats">
    <ion-nav-view name="tab-chats"></ion-nav-view>
  </ion-tab>

  <!-- Account Tab -->
  <ion-tab title="Account" icon-off="ion-ios-gear-outline" icon-on="ion-ios-gear" href="#/tab/account">
    <ion-nav-view name="tab-account"></ion-nav-view>
  </ion-tab>


</ion-tabs>
```

Először is, a fenti fájl tartalma egy konténerként fog szolgálni az alá deklarált view-k számára. Ez a konténer pedig az index.html ion-nav-views tag-ek közé fog renderelődni. Az ion-nav-view direktívák lesznek minden esetben a gyökerei a state alapú routing esetén a templateknek.

Fent létrehoztunk három tabot, azokhoz hozzárendeltünk 1-1 URL-t, ami valami state-re mutat. A kontrollereket az első odalátogatáskor fogja példányosítani, ahogy a template fájlokat is, utána mindezt cacheli. Ellenben nekünk nem lesz ilyesmire szükségünk most, mert nem használjuk ki a tab-okat és a routingot még, így töröljük ki ennek egy részét, ami után az app.js config szakasza így néz majd ki:

```
<pre data-language="javascript">.config(function($stateProvider, $urlRouterProvider) {
        
  $stateProvider
  .state('todo-list', {
    url: '/todos',
    templateUrl: 'templates/todolist.html',
    controller: 'TodoCtrl'
  });
        
  $urlRouterProvider.otherwise('/todos');

});
```

Hogy ne dobjuk el teljesen a routing funkcionalitást (mert anélkül is meg lehetne oldani a dolgot), ezért felvesszük a /todos URL-re a todo-list state-et és hozzárendeljük a saját kis kontrollerünket/templateünket. Minden más esetet erre redirektálunk majd. A templateket amik a templates mappában vannak töröljük és hozzunk létre egy todolist.html-t köztük:

```
<pre data-language="html"><ion-pane>
    <ion-header-bar><h1 class="title">Todos</h1></ion-header-bar>
    <ion-content>
        <ion-list>
            <ion-item>
                Take out da trash
            </ion-item>
        </ion-list>
    </ion-content>
</ion-pane>
```

Ez lesz a mi kis view-nk. Egy szimpla header, valamint egy lista, egy beégetett elemmel. Ahhoz, hogy semmi felesleges ne jelenjen meg ezen kívül, ezért az index.html-ben lévő body tag-et is szerkesszük az alábbiak szerint:

```
<pre data-language="html"><body ng-app="starter">
  <ion-nav-view></ion-nav-view>
</body>
```

Így már valamivel egyszerűbb, ugye? Egy dolog viszont még hiányzik, mégpedig a controllerünk. Szerkesszük hát a controllers.js-t:

```
angular.module('starter.controllers', [])

.controller('TodoCtrl', function($scope) {

    }
);
```

Itt lérehozunk egy új modult, a 'starter.controllers' néven, aminek nem lesznek függőségei más angular modulokra. Ezen létrehozunk egy controllert TodoCtrl néven. Az a function igazából kontrollerünk konstruktora lesz, ami megkapja paraméterként a $scope-ot. Ez a $scope egy érdekes dolog, ez fogja reprezentálni az applikációnkban a model réteget. Ezen fogunk műveleteket végezni, eseményeket propagálni, stb. Ők lesznek a kapcsoló elem a controller és a view között. Amikor direktívákat hozunk létre és ezeket összekapcsolja a templatekkel az angular, akkor a $scope elemein létrehoznak ún. $watchereket, amik a változókat figyelik, hogy az esetleges változás alapján módosítsák a DOM-ot. Tehát ha létrehozunk egy listát, a $scope-on, aminek a tartalmát kiíratjuk a view-ra, akkor elég a tartalmát változtatni ahhoz, hogy a view megváltozzon, de nézzük ezt működés közben!

Az imént ugye beégetett változóval írattuk ki a listát. Ha most megnézzük az alkalmazásunkat, akkor látjuk, hogy ott szerepel az egyetlen elem. Mi persze egy tömböt szeretnénk megjeleníteni, hát hogy lesz ez lehetséges? Egy direktívát kell hozzáfűznünk az ion-item-hez, mégpedig az ng-repeat-et:

```
<pre data-language="html"><ion-item ng-repeat="todo in todos">
    {{todo.name}}
</ion-item>
```

A fentiekben a sima ion-item működését kiegészítettük. Az ng-repeat megfelel egy foreach-nek, miszerint végigiterál a todos változó elemein, az aktuális változót eltárolja a todo-ban és ahány elem van, annyiszor fogja megjeleníteni az adott HTML elemet, amin deklaráltuk. Az elemen belül látjuk a {{todo.name}}-et, ami az angular templating technikája és csupán annyit csinál, hogy a todo.name változó értékét kiírja.

> **Fontos:** A todos változó itt megfelel a $scope.todos-nak

Akkor most jön az, hogy a $scope-ban létrehozzuk az alábbi változót:

```
<pre data-language="javascript">.controller('TodoCtrl', function($scope) {
        $scope.todos = [
        {
            name : "Take out da trash"
        }, {
            name : "Buy WinRAR"
        }];
    }
);
```

Ha most rápillantunk a böngészőre, akkor láthatjuk, hogy ott a két elem, ahogy azt vártuk. [![basiclist](assets/uploads/2016/07/basiclist.png)](assets/uploads/2016/07/basiclist.png)Na de ez nem túl szép, hiszen az adatot nem a kontrollerünknek kellene szolgáltatnia, hanem valami service-nek, nemde? Akkor takarítsuk ki először azt is:

```
<pre data-language="javascript">angular.module('starter.services', [])
```

A service-ünket factory-n keresztül fogjuk beregisztrálni. Csinálunk egy todoService-t, ezt átadjuk a controllerünknek, majd ezen keresztül fogjuk lekérni azt a bizonyos todos tömböt. Egyelőre ennek még nem sok értelmét látjuk, de a végén összeáll majd a kép.. remélem 🙂

```
<pre data-language="javascript">.factory('$todoService', function() {

        var todos = [{
            name : "Take out da trash"
        },{
            name : "Buy WinRAR"
        }];
        
        return {
            todos : todos
        };
    });
```

A fentiekben létrehozzuk a todoService-t, amiben deklaráljuk a tömböt ami eddig a kontrollerben volt. Fontos a return statement, mert az objektumot fogjuk használni később. Tehát megtehetjük azt, hogy ezzel tesszük az egyes metódusokat, stb. publikussá, hogy visszaadjuk azt, de erről is majd később. A controllers.js az alábbiak szerint változik:

```
<pre data-language="javascript">.controller('TodoCtrl', function($scope, $todoService) {
        $scope.todos = $todoService.todos;
    }
);
```

Láthatjuk, hogy a $scope-on felül immáron beinjektáljuk a $todoService-t is.

> Angularban többféleképpen lehet beinjektálni a függőségeket. Ez a fenti az ún. implicit injection. Ezzel vigyázni kell, mert ha minifikáljuk az applikációt, akkor a service-eink nevei megváltoznak és az applikációnknak annyi.

Akkor nézzük eddig hogy is működik: amikor megnyitjuk az app-ot, megvizsgálja az angular, hogy valamelyik URL matchel-e. Mivel nem, ezért redirektál a todos-ra, amihez hozzárendelt controllerünket és template-ünket betölti. A controllerünk példányosításakor megkapja a $scope-ot, valamint a $todoService által visszaadott objektumot. Ez utóbbiból lekéri a todos változót és hozzárendeli a $scope.todos-hoz. Ez a változás a controllerünkhöz rendelt template-en megjelenik, hála az ng-repeat annotációnak. Az app külsejét pedig az ion prefix-el ellátott tag-ek oldják meg.

Akkor most jöjjön az, hogy valami értelme is legyen az app-nak, tudjuk done állapotba tenni az egyes todokat, mégpedig mindezt egy szimpla touch-al/klikkel!

A service.js-ben adjuk hozzá az egyes todo-khoz a done property-t:

```
<pre data-language="javascript">var todos = [{
    name : "Take out da trash",
    done : false
},{
    name : "Buy WinRAR",
    done: true
}];
```

Ha ez megvan, akkor a todolist.html-t szerkesszük az alábbiak szerint:

```
<pre data-language="html"><ion-item 
        ng-repeat="todo in todos"
        ng-click="todo.done = !todo.done"
        >
    {{todo.name}}
</ion-item>
```

Az ng-click nevű direktíva az angularral jön és annyit tesz, hogy az utána megadott expression-t végrehajtja. Lehetne itt metódushívás is, de most szimplán annyit csinálunk, hogy negáljuk a booleanünk értékét. A böngészőben nézve, azonban azt látjuk, hogy semmi nem történt... Mégis mi a gond? Hát persze, nem adtunk hozzá semmit, ami jelezné számunkra, hogy milyen állapotban is van az adott todo elem.

```
<pre data-language="html"><ion-item
        ng-repeat="todo in todos"
        ng-click="todo.done = !todo.done"
        ng-class="todo.done ? 'completed' : ''">
    {{todo.name}}
</ion-item>
```

Bővítsük tovább a direktívát az ng-class-al. Ez a direktíva egy class-t fog hozzáadni az adott elemhez, mégpedig azt a class-t, amit az értékében tárolt kifejezés értékül ad. Szimpla javascript és ternary operator az egész. Ha a todo.done értéke igaz, akkor a completed class-t adja hozzá, ha nem, akkor üres string-et, tehát semmit.

Emlékszünk még a style.css-re? Itt az idő, hogy a completed class érjen is valamit, írjuk bele az alábbit:

```
<pre data-language="css">.completed {
    color: #aaa;
    text-decoration: line-through;
}
```

Most, ha rábökünk az egyik todo-ra, akkor áthúzott lesz és a színe változik, jelezve, hogy completed. Akkor jöjjön az, hogy hozzáadunk egy új taskot. A todolist.html template-ünkben az ion-header-bar tag-ek közé illesszük be az alábbi gombot:

```
<pre data-language="html"><ion-header-bar><h1 class="title">Todos</h1>
<button class="button button-icon">
    <i class="ion-compose icon"></i>
</button>
</ion-header-bar>
```

A fenti kódrészlet elhelyez számunkra egy gombot, ami jelenleg nem csinál semmit, de akkor adjunk hozzá valami funkcionalitást:

```
<pre data-language="html"><button class="button button-icon" ng-click="newTask()">
```

A gombra kattintva meghívódik a $scope.newTask metódusa, írjuk hát meg!

```
<pre data-language="javascript">$scope.newTask = function() {
    $ionicPopup.prompt({
        "title" : "New Task",
        "template" : "Enter description:",
        "inputPlaceholder" : "Rule the world",
        "okText" : "Create task"
    }).then(function(res) {
       if (res) $scope.todos.push({name : res, done: false});
    });
}
```

A fentiek során az ionicPopup service-t fogjuk használni és létrehozunk egy kis prompt ablakot. A metódus egy Promise-al tér vissza, ami sikeres befejeztekor meghívja a .then metódusban átadott callback-et és paraméterként átadja az input értékét. Ha az érték nem false, ami a Cancel gomb esetén következik be, akkor hozzáadjuk a todo listánkhoz a kapott névvel és egy false-al, mivel még nincs kész a feladat.[![newtask](assets/uploads/2016/07/newtask.png)](assets/uploads/2016/07/newtask.png)

Most, hogy már hozzáadni is tudunk, ideje lenne törölni is, amihez a listaelemeket kell kibővíteni a következőképp. Először is, vegyük fel az alábbi class-t az ion-item elemre:

```
<pre data-language="html">class="item-icon-right"
```

Ez azért lesz fontos, mert a listaelemekre elhelyezünk egy ikont, ami jelzi, hogy az elem mögött van valami és ezt fogja a helyére pozícionálni nekünk. Ha ez megvan, akkor az ion-item elemek közé vegyük fel az alábbit:

```
<pre data-language="html"><i class="icon ion-ios-arrow-left"></i>
<ion-option-button class="button-assertive" ng-click="todos.splice($index, 1)">
    Delete
</ion-option-button>
```

A fenti 'i' tag fogja megjeleníteni számunkra a kis nyilat, ami egyértelművé teszi a felhasználónak, hogy ez nem csak egy szimpla listaelem. A mögötte levő gomb pedig annyit csinál, hogy kitörli az aktuális elemet ha rákattintunk. Az $index változó az ng-repeat direktíva hozadéka, amivel megkapjuk minden iterációban az adott index-et, így tudjuk hol járunk a tömbben. A button-assertive pedig piros színnel látja el a gombunkat.[![opened](assets/uploads/2016/07/opened.png)](assets/uploads/2016/07/opened.png)

> Az Ionicban az egyes színeket egyes hangulatokról nevezték el.

Ha most megnézzük, akkor az egyes listaelemek elhúzhatóak balra és mögötte található gomb pedig törli azt az elemet. Akkor jöhet a törlés!

```
<pre data-language="html"><ion-option-button class="button-energized" ng-click="edit(todo)">
    Edit
</ion-option-button>
```

Újabb elem az ion-item tag-ek közé. A button-energized miatt ez már sárga színű lesz és clickre pedig a $scope.edit metódust hívja meg, hozzuk hát azt létre:

```
<pre data-language="javascript">$scope.edit = function(todo) {
    $scope.data = {response : todo.name };
    $ionicPopup.prompt({
       title : "Edit task",
       scope : $scope
    }).then(function(res) {
        if (res !== undefined) {
            todo.name = $scope.data.response;
        }
    });
};
```

Na ez már némileg bonyolultabb. A $scope-on létrehozunk egy data objektumot, aminek átadjuk a response kulcson a task nevét. Ebben kapja meg a prompt az aktuális értéket és később ezt is fogjuk lekérni. Ezután átadjuk neki a popup címét és a $scope-ot. Ha leokéztuk, akkor a taskunk nevét felülcsapjuk a régivel.[![edit](assets/uploads/2016/07/edit.png)](assets/uploads/2016/07/edit.png)

Próbáljuk ki.. és működik!... illetve valami mégsem, mert a listaelem nem csúszott vissza. Ezt úgy tudjuk megoldani, hogy az Ionic egyik service-ét meghívjuk és szólunk neki, hogy a listaelemeket ugyan csukja már vissza. Ehhez be kell oktrojálnunk azt a kontrollerünkbe:

```
<pre data-language="javascript">.controller('TodoCtrl', function($scope, $todoService, $ionicPopup, $ionicListDelegate) {
```

Ha ez megvan, akkor a fenti kódba szúrjuk be ezt a sort az alábbiak szerint:

```
<pre data-language="javascript">if (res !== undefined) {
    todo.name = $scope.data.response;
    $ionicListDelegate.closeOptionButtons(); // becsukjuk az elemet
}
```

Így amikor beállítjuk az értéket, akkor a listaelemet is visszahelyezzük a helyére. A legalapabb funkcionalitás megvan, most nézzük, milyen a telefonunkon?

Az [iOS](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html) buildhez OS X kell, valamint XCode, tehát csak Apple fanboyok vagy VMWare hákolók számára opció. Az [Android](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html) buildhez Android SDK kell és Java JDK.

Ez utóbbit fogom én bemutatni. Az ionic-ot használva elég egyszerű a dolog:

```
<pre data-language="shell">ionic run android
```

Ez a háttérben meghívja a cordovát, ami a háttérben meghívja a gradle-t, az pedig az Android SDK-t használva lebuildeli a projektet és kirakja a telónkra.

> Akinek nincs a fejlesztői mód engedélyezve, az a telefonjában keresse meg az 'About' vagy 'A telefonról' menüpontját, amin belül a build számra nyomogatva tudja aktiválni a fejlesztői módot. Ezután egy új menüpont jelenik meg, amibe navigálva az USB-debugging/hibakeresést kapcsoljuk be. Ezután tudjuk majd a telefonunkon engedélyezni a gépet, hogy hozzáférjen ahhoz.

A deploy után pár másodperccel megjelenik a böngészőben is látott nézet. Viszont amikor ki-be lépkedünk, észre fogjuk venni, hogy bizony az egyes todo-k nem tárolódnak, hanem minden megnyitáskor újra azt látjuk, amit felvettünk a kódban.

A következő alkalommal megnézzük hogy is tudjuk ezeket letárolni, felszinkronizálni egy szerverre, új listákat létrehozni, azokat megosztani másokkal és még sok mást!

</body>