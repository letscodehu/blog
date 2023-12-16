---
id: 1266
title: 'Cross Platform mobilosodás &#8211; 2. rész'
date: '2016-09-18T17:50:34+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1266'
permalink: /2016/09/18/cross-platform-mobilosodas-2-resz/
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
image: 'assets/uploads/2016/09/09202251/Rockford_MergeSign_WEB.jpg'
categories:
    - Angular
    - JavaScript
tags:
    - angular
    - 'cross platform'
    - ionic
    - javascript
    - js
    - mobile
---

Az előző részben kitárgyaltuk hogy is lehet könnyen hibrid [mobilalkalmazásokat]({{ site.url }}/2016/07/23/cross-platform-mobilosodas-1-resz/) készíteni, aztán szó esett a [RESTful]({{ site.url }}/2016/08/26/konstrualjunk-web-api-t/) webservicek készítéséről is, amivel aztán ezt ki is tudjuk majd szolgálni. Most ismét rajtunk a sor, hogy a kettőt valahogy összerakjuk!

[![Rockford_MergeSign_WEB](assets/uploads/2016/09/Rockford_MergeSign_WEB.jpg)](assets/uploads/2016/09/Rockford_MergeSign_WEB.jpg)

Az előző alkalmazásunk igencsak egyszerű volt, az adatokat lokálisan kezeltük, volt egy kezdeti tömb, ami minden induláskor használt az alkalmazás, tehát akármit módosítottunk rajta, ha újraindult az app, akkor mindig abból indultunk ki. Ez nem valami hatékony, hogy újraindításonként újra fel kell venni azokat. Az első lépés az volna, hogy egy perzisztencia réteget bevezessünk, tehát letároljuk az információt a mobilon.

Akkor most kezdjünk egy kicsit fabrikálni rajta.

Ugyebár az adatainkat amiket megjelenítünk a templateben a $scope változóban tároljuk. Ahhoz, hogy ide eljusson, a controllerünk meghívja az ezért felelős service-t, ami pedig szintén meghívja a szükséges transformert vagy éppen a $http service-t, $cache-t, ami épp kell, tehát egyfajta facade módjára elburkolja a dolgokat és egy viszonylag egyszerű interfészt biztosít. Akkor nézzük a mi service-ünk hogy is nézett ki a legutóbb:

```
<pre data-language="javascript">angular.module('starter.services', [])

.factory('$todoService', function() {

        var todos = [{
            name : "Take out da trash",
            done : false
        },{
            name : "Buy WinRAR",
            done: true
        }];

        return {
            todos : todos
        };
    });
```

Nem az igazi ugye? Na most amire nekünk szükségünk lesz az angular $injector service, amivel a $todoService-be beleinjektálunk egy $http-t, amin keresztül el tudjuk majd érni a múltkor készített REST API-t. Persze fel kell készülnünk majd az offline működésre is, erről is szó esik majd. Akkor alakítsuk át kicsit a dolgot:

```
<pre data-language="javascript">.factory('$todoService', ['$http', function($http) {

        var todos = [];

        return {
            todos : todos
        };
    }]);
```

Láthatjuk, hogy most egy üres todo tömbbel kezdünk. Ez még mindig nem az igazi, ha már bent van a $http service, használjuk, kérjük le a szerverről azokat a todokat!

Azonban mielőtt nekilátnánk, jöjjön egy apróság a backenden. Mivel a kéréseket JS által végezzük, egy másik domainről, ezért szükségünk lesz a szerveroldalon némi beállításra, hogy a kliensünk lelkivilága nyugodt legyen. Ez a dolgot Access-Control-Allow-Origin header sora végzik, ami kiköti, hogy mely domainekről engedünk lekéréseket kiszolgálni. Ahhoz, hogy ezt megtegyük, szükségünk lesz <del>egy header bejegyzésbe a .htaccess-ben és leszarhatjuk a többit</del> egy composer csomagra, valamint némi Zend style hegesztésre, úgyhogy védőszemüvegre fel!

Először is telepítsünk a zfr/zfr-cors csomagot:

```
composer require "zfr/zfr-cors:1.*"
```

Ha ez megvolt, akkor az új modulunkat vegyük fel a config/modules.config.php-ben:

```
<pre data-language="php"> return [
    // többi Zendes csomag
   "ZfrCors",
];
```

Ha ez is megvolt, akkor a config/autoload mappába másoljuk át a vendor/zfr/zfr-cors/zfr\_cors.global.php.dist fájlt (és természetesen a .dist kiterjesztést vágjuk le a végéről). Ebben a fájlban minket legfőképp az allowed origins rész fog érdekelni, itt állítsuk be a teszteléshez a **http://localhost:8100**-at, az ionic itt fut, valamint az engedélyezett headerekhez adjuk hozzá amiket használni fogunk:

```
<pre data-language="php">return [
    'zfr_cors' => [
         /**
          * Set the list of allowed origins domain with protocol.
          */
          'allowed_origins' => ['http://localhost:8100'],

         /**
          * Set the list of HTTP verbs.
          */
         'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

     ...
];
```

Ha ezzel megvoltunk, akkor már nem fogjuk a fejünket vakargatni a console hibák láttán. Vissza a frontendre hát!

Eddig ugye fix datasettel dolgoztunk, amit habár a service-ből kaptunk, statikus volt. Az angular-ui routingja alapesetben cache-eli a controller instancejainkat, tehát minden controllert csak egyszer példányosít majd. Ez lehetővé teszi azt, hogy bevezessünk egy inicializáló metódust, anélkül hogy aggódni kelljen amiatt, hogy újra és újra inicializálja azt, ezáltal felesleges terhelést okozva a szerver felé. Hozzuk létre hát a metódust a controllerben:

```
<pre data-language="javascript">.controller('TodoCtrl', function($scope, $todoService, $ionicPopup, $ionicListDelegate) {

        function init() {
            $todoService.fetchPage().then(function(response) { // meghívjuk a service-t és amikor végzett, a visszatérő eredményt felhasználjuk
               $scope.todos = response;
            });
        }
        init(); // meghívjuk az init-et, amikor példányosítjuk a controllerünket.
```

Most, hogy ezzel megvagyunk, a service-ben is vezessük be a megfelelő hívást:

```
<pre data-language="javascript">.factory('$todoService', ['$http','$q', function($http, $q) { // beinjektáljuk a $http és a $q service-t, 
  // előbbivel adatainkat tudjuk lekérni, utóbbi pedig az aszinkron feldolgozásban segít nekünk

        var resourceLink = "http://todo.localhost.hu/todo"; // a resource alap URL-je, minden innen indul ki, a többi elérési utat majd medialinkekből kapjuk meg

        function fetchPage() {
            var deferred = $q.defer(); // létrehozunk egy deferred objektumot
            $http.get(resourceLink).then(function(response){ // meghívjuk GET-el a linket, a visszatérési értékből pedig kikérjük az adatokat és visszatérünk velük
                deferred.resolve(response.data._embedded.todo);
            });
            return deferred.promise; // visszaadunk belőle egy thenable-t
        }
```

Ezzel már sikerült is elérnünk, hogy a controller létrejöttekor meghívja a szervert és visszaadja a taskokat, amiket felvettünk. A deployolt API-t a todo.localhost.hu-ra mappeltem, de használhatjuk a PHP beépített szerverét is, rögtön az APIgility-ből. Viszont a gond az, hogy amit ezután végzünk velük, azt továbbra is csak lokálisan tesszük, így hiába adunk hozzá egy újat, a változásaink elvesznek az újraindításkor. A komplett CRUD-on végig kell tehát vezessük a módosításokat.

A következő ilyen a hozzáadás lesz. Ezt egy prompt ablakkal oldottuk meg, ami hozzáadott a tömbhöz, amivel dolgoztunk. Fontos megjegyezni, hogy mindig a szerver által visszaadott értékekkel dolgozzunk, mert lehet teljesen más adatok lesznek benne, függően filterektől, auto increment, stb. értékektől. Az új forma a controllerben az alábbi módon néz ki:

```
<pre data-language="javascript">$scope.newTask = function() {
    $ionicPopup.prompt({
        "title" : "New Task",
        "template" : "Enter description:",
        "inputPlaceholder" : "Rule the world",
        "okText" : "Create task"
    }).then(function(res) {
       if (res) $todoService.add(res).then(function(response) { // ha nem üres a stringünk, akkor meghívjuk a service-t, átadjuk neki a nevet, amit megadtunk.
           $scope.todos.push(response); // A visszatérő elemet pedig hozzáadjuk lokálisan is a listánkhoz
       });
    });
};
```

Akkor most nézzünk el a servicebe is, az új add metódust miként is implementáljuk:

```
<pre data-language="javascript">function add(name) {
    var deferred = $q.defer(); // deferred objektum ismét
    $http.post(resourceLink, {"name" : name, "done" : 0}).then(function(response) { // ugyanazon a linken történik, csak most POST kérés. A done alapból 0 lesz.
        deferred.resolve(response.data) // a visszatérő értéket pedig visszaadjuk a hívónak, ami már maga a todo reprezentációja lesz
    });
    return deferred.promise;
}
```

Bumm, ennyi lett volna a hozzáadás is. Ha kipróbáljuk, akkor láthatjuk, hogy a listához hozzáadásra kerül, de ez eddig is ment. Frissítsük az oldalt és itt jön a differencia, ugyanis az újonnan felvett értékek immáron megmaradnak. Itt jön az, ahol fontossá válnak azok a bizonyos linkek. Emlékszünk még hogy is néznek ki a todo reprezentációi?

```
<pre data-language="javascript">{
 "id":"3",
 "name":"4234234",
 "done":"1",
 "_links": {
  "self":
    {
      "href":"http:\/\/todo.localhost.hu\/todo\/3"
    }
  }
}
```

Nos, valahogy így. A lényeg, hogy benne van a konkrét elérési út is, így nem nekünk kell kézzel összerakni azt, ugyanis ezen az elérési úton tudunk módosítani és törölni is entitásokat. Akkor jöjjön valami egyszerűbb, pipáljunk ki egy taskot! Ennek az első része a templateben lesz, mégpedig az ng-click mostmár nem szimplán egy boolean értéket fog kapcsolgatni, hanem meghív egy metódust és átadja neki az aktuális todo reprezentációt.

```
<pre data-language="html"><ion-item
        class="item-icon-right"
        ng-repeat="todo in todos"
        ng-click="toggleState(todo)"
        ng-class="(todo.done == 1) ? 'completed' : ''"
```

Az ng-class feltétele eddig szimplán az értéken múlt, mostmár azt egy numberrel vetjük össze. Ez azért kell, mert a backend felől nem booleanként érkezik a dolog, hanem tinyint-ként.

Ahhoz, hogy ez ne okozzon problémát, a done mezőnkre az API-ban húzzunk rá egy boolean casting filtert:[![Selection_021](assets/uploads/2016/09/Selection_021.png)](assets/uploads/2016/09/Selection_021.png)

Ha ezzel megvoltunk, akkor nézzük az emlegetett toggleState metódust:

```
<pre data-language="javascript">$scope.toggleState = function( todo) {
    var modifiedTodo = todo; // egy ideiglenes változóba tesszük
    modifiedTodo.done = (todo.done == 1) ? 0 : 1; // megfordítjuk a done státuszát
    $todoService.modify(modifiedTodo).then(function(newTodo) {
        todo = newTodo; // az eredeti task értékét felülcsapjuk a szerver felől kapottal
    });
}
```

A képlet egyszerű, megkapjuk az eredeti objektumot, lemásoljuk egy új változóba, átbillentjük a done-t, meghívjuk a modify-t a service-en, az általa visszakapott értékkel pedig felülírjuk az eredetit. A service-ben mindeközben:

```
<pre data-language="javascript">function modify(todo) {
    var deferred = $q.defer(); // deferred objektum
    $http.put(todo._links.self.href, { // a todo-ban tárolt linken érjük el azt PUT methodal
       name : todo.name, // csak a lényeges elemeket rakjuk bele
       done: todo.done 
    }).then(function(response) {
        deferred.resolve(response.data); // visszaadjuk az értéket
    });
    return deferred.promise;
}
```

Nagyjából annyi történik, hogy meghívjuk PUT-al az objektum önmagára mutató linkjét, a módosított mezőket átadjuk, aztán ami visszatért felülírja az előzőt.

> Igen, ennyi példa után már bizonyára feltűnt, hogy a hibakazelés kimaradt. Ezt mindenki a saját szájíze szerint teheti meg, de majd nézünk rá 1-2 példát a végén.

Némileg hasonló lesz az edit is, azt leszámítva, hogy ott a prompt ablak visszatérése után történik meg a változtatás.

```
<pre data-language="javascript">$scope.edit = function(todo) {
    $scope.data = {response : todo.name }; // beállítjuk a jelenlegi állapotát a textboxnak
    $ionicPopup.prompt({
       title : "Edit task",
       scope : $scope // kap egy $scope-ot a promptablak is
    }).then(function(res) {
        if (res !== undefined) { 
            var modifiedTodo = todo; // egy ideiglenes változóba tesszük 
            modifiedTodo.name = $scope.data.response; // módosítjuk a nevét a tasknak
            $todoService.modify(modifiedTodo).then(function(newTodo) { // átadjuk a service-nek
                todo = newTodo; // a visszatérési értékkel felülcsapjuk
                $ionicListDelegate.closeOptionButtons(); // becsukjuk az elemet
            })
        }
    });
};
```

Láthatjuk, hogy alapjaiban ugyanazt csináltuk itt is, ráadásul a modify service-t már megírtuk, így már ennek is működnie kell. A következő már némileg trükkösebb lesz, mert a törléskor nem bízhatunk a visszatérési értékben, lévén a DELETE nem fog body-t visszaadni. A template-ben tehát át kell adjuk az $index-et is, hogy később tudjunk ez alapján hivatkozni az elemre a dataseten belül, a törléshez:

```
<pre data-language="html"><ion-option-button class="button-assertive" ng-click="remove(todo, $index)">
    Delete
</ion-option-button>
```

A controllerben is csináljunk egy remove metódust a célra:

```
<pre data-language="javascript">$scope.remove = function(todo, $index) {
    $todoService.remove(todo).then(function() { // átadjuk az elemet a service-nek
        $scope.todos.splice($index, 1); // ha sikerrel járt, akkor a datasetből kivágjuk az elemet
    });
};
```

Nézzük a service-t:

```
<pre data-language="javascript">function remove(todo) {
    var deferred = $q.defer(); // deferred objektum
    $http.delete(todo._links.self.href).then(function() { // a beágyazott linket használjuk ismét
        deferred.resolve(); // mivel nem ad vissza body-t, ezért nincs is mit visszaadni
    })
    return deferred.promise;
}
```

A módszer közel ugyanaz, mint a korábbiakban, az entityvel érkező link segítségével nem kell sehova beégetni semmit. Az alap CRUD műveletekkel végeztünk is, némileg kihasználjuk a médialinkeket is, de pár dologra még ki kell térnünk, Lokálisan is le kéne cache-elni a dolgot, valami queue-t is bevezethetnénk, ami próbálja a háttérben felszinkronizálni a változtatásainkat. Gondoskodnunk kellene a hibakezelésről, pl. ha nincs netkapcsolat, de mindent a maga idejében, ezeket későbbre tartogatjuk!

A módosított projekt elérhető [githubon](https://github.com/letscodehu/todoIonic/tree/second_part).