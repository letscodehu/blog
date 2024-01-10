---
id: 1376
title: 'Angular Typescript módra &#8211; 3. rész'
date: '2016-12-04T21:03:43+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1376'
permalink: /2016/12/04/angular-typescript-modra-3-resz/
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
image: 'assets/uploads/2016/12/09202334/731201600143778519.jpg'
categories:
    - Angular
    - JavaScript
tags:
    - angular
    - angular2
    - blog
    - frontend
    - javascript
    - typescript
    - wordpress
---

Az előző [cikkben]({{ site.url }}/2016/11/08/angular-2-typescript-modra-2-resz/) összeraktunk egy igen egyszerű statikus adatokat használó listázást. Jelenleg kegyetlenül vacakul fest, no meg a lényeg még nincs benne, a routing, amivel bele tudnánk navigálni az egyes elemekbe. Nézzük, hogy mi is szükséges ahhoz, hogy mindez valahogy kinézzen, de először a routingot és az ahhoz szükséges dolgokat fogjuk bekötni![![route66](assets/uploads/2016/12/route66.jpg)](assets/uploads/2016/12/route66.jpg)

Az első és legfontosabb dolog ami a routinghoz kell, az a jó öreg `<base>` tag beállítása lesz. Na de miért is van erre szükségünk? Nos azért, mert a HTML5 style history API-t használja a routing a háttérben, ennélfogva, a #-t elfelejthetjük az URL-jeinkből, tehát az index.html-be tegyük is bele a head szekcióba:

```
<base href="/">
```

Ha ezzel megvolnánk, akkor mehetünk is tovább, immáron JS oldalon. Sajna megint szükségünk lesz egy kis szerkezeti átalakításra, mégpedig azért, mert létre kell hoznunk egy csomópontot, amiben az angular cserélgeti majd az adott routehoz tartozó templateket. Ehhez hozzunk létre egy` layout.component.ts`-t:

```
import {Component} from '@angular/core';

@Component({
 selector: 'layout',
 template: `
 <router-outlet></router-outlet>
 `
})
export class LayoutComponent {
}
```

A fenti komponens semmi másért nem felelős jelenleg, mint tartalmaz egy ún. `router-outlet` taget, ami az angular 1-beli `ng-view` megfelelője. Ennek a belsejébe fogja mozgatni az adott routeért felelős komponens templatejét. Írjuk is át az index.html-ben a `post-list` tag-et `layout` -ra:

```
<body>
 <header><div class="container"></div></header>
 <layout>Loading...</layout>
 <footer><div class="container"></div></footer>
 </body>
```

Később persze még teszünk ezt-azt ebbe a layoutba, de most egyelőre ennyi. A másik view, amit még meg akarunk valósítani, az a single post nézet lesz, ahol némileg több infót jelenítünk meg egy-egy cikkről, mint a listában. Ennek is csináljuk meg a komponenst, egyelőre még nagyon üresen a` single-post.component.ts` fájlba:

```
import {Component} from '@angular/core';

@Component({
 selector : 'single-post',
 templateUrl : 'templates/single-post.html'
})
export class SinglePostComponent {

}
```

Valamint a hozzá tartozó template-be is tegyünk valamit, amivel le tudjuk ellenőrízni, hogy valóban oda navigáltunk-e majd:

```
<p>This will be our single post view.</p>
```

Ahol viszont igen nagy változás lesz, az biza az `AppModule` lesz. Nézzük először a végeredményt, utána pedig menjünk sorba, hogy mik is változtak:

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PostListComponent } from '../components/post-list.component';
import {LayoutComponent} from '../components/layout.component';
import {SinglePostComponent} from '../components/single-post.component';
import {HttpModule} from '@angular/http';
import {PreviewPipe} from '../pipes/preview';
import {RouterModule} from '@angular/router';

const routes = [
   {
      path : 'posts',
      component : PostListComponent,
   },
   {
      path : 'post/:id',
      component : SinglePostComponent
   },
   {
      redirectTo : 'posts',
      path : '',
      pathMatch : 'full' 
   }
 ];

@NgModule({
 imports:[ BrowserModule, HttpModule,
 RouterModule.forRoot(routes) 
 ],
 declarations : [ PostListComponent, SinglePostComponent, LayoutComponent, PreviewPipe ],
 bootstrap : [LayoutComponent]
})
export class AppModule { }
```

Először is behúztuk az új komponenseinket:

```
import {LayoutComponent} from '../components/layout.component';
import {SinglePostComponent} from '../components/single-post.component';
```

Valamint bekerült a `RouterModule` is:

```
import {RouterModule} from '@angular/router';
```

Ezután definiáltuk a routejainkat:

```
const routes = [
   {
      path : 'posts',
      component : PostListComponent,
   },
   {
      path : 'post/:id',
      component : SinglePostComponent
   },
   {
      redirectTo : 'posts',
      path : '',
      pathMatch : 'full' 
   }
 ];
```

Na itt azért álljunk meg egy pillanatra. A felső routeban hozzákötjük a `/posts`-hoz a `PostListComponent`-et, utána a `/post/:id`-re, ahol az `:id` egy paraméternek ad helyet, bekötjük a `SinglePostComponent` -et és ha a `/`-re érkezünk, redirektálunk a `/posts` -ra. Ezt a konfigurációt beleoktrojáljuk a `Routermodule`-ba és hozzáadjuk az importok listájához:

```
 imports:[ BrowserModule, HttpModule,
 RouterModule.forRoot(routes) 
 ],
```

Valamint a már említett új komponensünket is felvesszük a declarations tömbbe:

```
 declarations : [ PostListComponent, SinglePostComponent, LayoutComponent, PreviewPipe ],
```

Na és ezzel mire is jutottunk? Nos amikor megnyitjuk az alkalmazást, akkor a layout tag betölti a `LayoutComponentet`, aminek biza része egy` router-outlet` tag, amibe az adott URL mentén betölti a view-t, Mivel alapból a root URL-re érkezünk, ezért redirektál minket a `/posts`-ra, ahol matchel az első route. Ennek fényében betölti a hozzá tartozó template-et és beteszi a `router-outlet` tag-ek közé azt. Ha átírjuk a címsorban az URL-t `/route/42` -re, akkor láthatjuk az új komponensünket is:

[![Selection_068](assets/uploads/2016/12/Selection_068.png)](assets/uploads/2016/12/Selection_068.png)

Hát azért ettől nem megyünk a falnak, ugye? Na meg mindenféle fancy dolgot ígértem anno, így nem ártana meg is valósítanom őket. Az első és legfontosabb dolog, hogy bizony a kedves felhasználó nem fogja átírni az URL-t kézzel, így a navigációt meg kellene oldanunk, nemde? Ez viszonylag egyszerű lesz. ID alapján fogunk navigálni majd, ezért vegyünk fel a `posts.json`-ben `post_id` mezőket. Ha ez megvan, akkor a `post-list.html`-ben kell beletennünk egy linket:

```
  <h2 class="post-title"><a routerLink="/post/{{post.post_id}}">{{post.post_title}}</a></h2>
```

A routerLink fog átalakulni majd mindenféel csodás attribútumokká, amibe most nem mennék bele, de a lényeg, hogy ezzel elértük azt, hogy az adott ID-jú cikkre mutató linkünk legyen. Akkor jöjjön az, hogy ezt a cikket biza meg kéne jeleníteni!

Ami ezek után jön, az kőkemény fekete mágia lesz, csak az igazán elszántaknak![![731201600143778519](assets/uploads/2016/12/731201600143778519.jpg)](assets/uploads/2016/12/731201600143778519.jpg)

Az első amit meglépünk, az a servicehez való hozzáadás lesz: kell egy metódus, amivel egy posztot tudunk lekérni, editáljuk hát a `post.service.ts` -t:

```
 public getPost(id : number) : Promise<Post> {
   return this.http.get(this.singleUrl + id).toPromise()
     .then((response) => {
        return response.json()
        .data as Post;
     }).catch(this.onError);
 }
```

> Mivel még nincs kész az API, amivel dolgozni szeretnénk, ezért a lite-server által kiszolgált fájlokat fogjuk használni. Ennek megfelelően szükségünk lesz egy `posts` mappára, amiben elhelyezünk pár fájlt, hogy ezzel szimuláljuk azt, hogy több resource is van benne. Később persze utánahúzunk egy apigility-t, de egyelőre marad ez a fajta hack.

Ahhoz, hogy a fenti működjön, szükségünk lesz egy singleUrl változóra is:

```
private singleUrl : string = "/posts/";
```

Ez persze most fenemód ellentmond a `HATEOAS`-nak, de majd arra is sort kerítünk. Tehát eddig megvan a listában a tovább gomb, már az is megvan, hogy mi figyeljen az URL-re, megvan a getPost a service-ben is, akkor a következő lépés az lesz, hogy a `SinglePostComponent`-et kicsit megpatkoljuk és a template-ét is editáljuk. Megmutatom megint a végeredményt és utána átnézzük a változásokat.

```
import {Component, OnInit } from '@angular/core';
import {PostService} from '../services/post.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import {Post} from '../domain/post';
import 'rxjs/add/operator/switchMap';

@Component({
 selector : 'single-post',
 providers : [PostService],
 templateUrl : 'templates/single-post.html'
})
export class SinglePostComponent implements OnInit {
 private post: Post;

 public constructor(
   private postService : PostService, 
   private route: ActivatedRoute, 
   private location : Location) { 
 }

 public goBack() : void {
   this.location.back();
 }

 ngOnInit() : void {
   this.route.params
   .switchMap((params: Params) => 
      this.postService.getPost(+params['id']))
   .subscribe((p) => {
     this.post = p;
   });
 } 
}
```

Na már kezd körvonalazódni a feketemágia? Akkor nézzük mi is történt! Először is behúztunk egy rakat új függőséget:

```
import {Component, OnInit } from '@angular/core';
import {PostService} from '../services/post.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import {Post} from '../domain/post';
import 'rxjs/add/operator/switchMap';
```

Az `OnInit` egy interfész lesz, amit implementálva fel tudunk iratkozni a komponens életeseményeire és így a konstruktorból ki tudjuk szedni a csúnyaságokat. A `PostService` egyértelmű, hogy kell, valamint szükségünk lesz az `ActivatedRoute`-ra és a `Params`-ra, lévén az alapján kérjük majd le az illetékes bejegyzést. A `Location` azért kell, hogy tudjunk visszanavigálni, a `Post` a komponens által megjelenített tartalom, az rxjs pedig arra szolgál, hogy az egyik ilyen `Observable` objektumot rámappeljük egy másikra, de erről majd az érintett szekciónál.

A következőnek felvesszük a Providers-be a service-ünket:

```
 providers : [PostService],
```

Majd implementáljuk az OnInit-et:

```
export class SinglePostComponent implements OnInit {
```

Ezután felvesszük a belső változónkat, amit a templateben fogunk használni:

```
 private post: Post;
```

Egy kis TypeScript mágia következik:

```
 public constructor(
   private postService : PostService, 
   private route: ActivatedRoute, 
   private location : Location) { 
 }
```

Ez ugye egy rövidítése annak, mintha felvennénk a fenti változókat privátként, ezután a konstruktorban pedig egyesével értéket adnánk nekik a paraméterek alapján. A következő elem igazából csak egy navigációt tesz lehetővé, amivel vissza tudunk navigálni a listaoldalra, illetőleg az előző oldalra, ha később más útvonalról szeretnénk jönni:

```
public goBack() : void {
   this.location.back();
 }
```

Na de aki azt hitte, hogy érti mi is történik és szerinte az Angular 2 igazából totál hasonló az egyhez:

```
ngOnInit() : void {
   this.route.params
   .switchMap((params: Params) => 
      this.postService.getPost(+params['id']))
   .subscribe((p) => {
     this.post = p;
   });
 }
```

Az vessen egy pillantást a fenti kódrészletre.. hát ez gyönyörű, nemde? Na de mégis mit is csinálunk itt? Angular 1-ben a paramétereket könnyedén ki lehetett nyerni, itt viszont ez sem a régi. A params, az igazából egy `Observable`, tehát fel tudunk iratkozni azokra az eventekre, amiket dob, jelen esetben egyre, ami tartalmazni fogja a `Params` nevű immáron adatokkal teli ojjektumot. Tehát mi mit is csinálunk? A `switchMap`-el rácsücsülünk erre az objektumra és amikor emittálja a kis eventjeit, az azzal jövő adatot átadjuk a postService-ünknek és visszaadunk egy másik `Observable`-t, amire szintén feliratkozunk, ez pedig már a mi kis `Post` ojjektumunkat fogja visszaadni, amit rögtön hozzá is rendelünk a tagváltozónkhoz. Ráadásul mivel ezt az `ngOnInit`-ben tesszük, ezért ezt majd az Angular meghívja, miután példányosította az osztályunkat, viszont mégsem elég korán, de erre majd visszatérünk. Jöjjön akkor a template, `single-post.html`:

```
<header *ngIf="post" class="intro-header" style="background-image: url('images/macbook-computer-clean-hero.jpg')">
 <div class="container">
  <div class="row">
   <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
    <div class="post-heading">
     <h1>{{post.post_title}}</h1>
    </div>
   </div>
  </div>
 </div>
</header>
<article *ngIf="post"> 
 <div class="container">
  <div class="row">
   <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1" [innerHTML]="post.post_content"></div>
   </div>
  </div>
</article>
```

Kicsit alakítottunk a dolgon, mostmár egy fokkal jobb lett az egész, jöhet még egy kis `style.css` (amiben annyira jó vagyok, ugye... ):

```
.intro-header {
 background: center center no-repeat;
 -webkit-background-size: cover;
 -moz-background-size: cover;
 background-size: cover;
 -o-background-size: cover;
 margin-bottom: 50px;
}

img {
 display:block;
 padding-bottom: 10px;
 padding-top: 10px;
 margin:0 auto;
}

.post-link a {
 font-weight: bold;
 text-decoration: none;
 color : #888;
 margin-top: 10px;
 padding: 10px 0px;
}

.post-preview {
 padding-bottom: 30px;
 border-bottom: 1px solid #999;
}

.post-heading {
 margin: 150px 20px;
 color: white;
}
```

Vegyük is fel az index.html-ben a bootstrap után:

```
 <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
 <link rel="stylesheet" href="css/style.css">
```

Valamint mostmár nem kell az eddigi header/footer tag se:

```
 <body>
   <layout>Loading...</layout>
 </body>
```

A listanézetünk azonban még mindig nem az igazi, tegyünk oda is egy headert a `post-list.html` -be:

```
<header class="intro-header" style="background-image: url('images/macbook-computer-clean-hero.jpg')">
 <div class="container">
  <div class="row">
   <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
    <div class="post-heading">
     <h1>Letscode.hu demo</h1>
    </div>
   </div>
  </div>
 </div>
</header>
```

> Akinek nincs meg a fenti szolid 2 megás macbook-os kép, az szégyellje magát és keressen egy jobbat 😀

A post-titel-ről vegyük le a linket és inkább csináljunk egyet külön:

```
<h2 class="post-title">{{post.post_title}}</h2>
<div class="post-excerpt" [innerHTML]="post.post_content | preview"></div>
<div class="post-link"><h4><a routerLink="/post/{{post.post_id}}">Tovább a cikkhez...</a></h4></div>
```

Ha mindent jól csináltunk, akkor a főoldal most valahogy így festhet (persze ez a posts.json adataitól is nagyban függ:

[![Selection_069](assets/uploads/2016/12/Selection_069.png)](assets/uploads/2016/12/Selection_069.png)

Igen, jól sejtitek, csaltam, mert nekem már arra az API-ra mutat, amiből wordpress cikkeket tudunk majd kiszolgálni! :). Na most nézzük, mi is van akkor, ha rábökünk a 'Tovább a cikkhez...' linkjére?

Itt szükségünk lesz a már korábban említett posts mappára és abban egy '1'-es elnevezésű fájlra, vagy amilyen ID épp csücsül mögötte:

```
{
 "post_title": "HypeScript",
 "post_content": "A múltkori mobilos cikkre megkaptam, hogy inkább az Ionic 2-re vagy React Native-ra kellene fókuszálnom. A dolgot megfogadom, ám ahhoz, hogy az Ionic 2-re rátérhessünk, nem ártana végigjárni az utat hozzá. Ehhez az els&#337; lépés a typescript lesz, utána jöhet az Angular2, majd az Ionic 2/Electron és/vagy a Unity-re is sor kerülhet, C# helyett typescript alapon.\r\n\r\n\r\n\r\n\r\n\r\nNa most mi is az a typescript, miért is jó nekünk és miért is lesz rá szükségünk a kés&#337;bbiekben?\r\n\r\nHaladjunk szép sorban a válaszokkal: A TypeScript a JavaScript egy úgynevezett supersetje, tehát a JavaScript kib&#337;vítése, típusokkal felvértezve és ami a lényeg, hogy sima mezei JavaScriptre fordul, amit a böngész&#337;k szó nélkül megesznek.\r\n\r\nFordul?? \r\n\r\nIgen, a TypeScriptben írt kódot le kell fordítanunk, ami ugyan nem egy gradle build, hogy percekig tartson, de legalább elindultunk a fordítások közti index olvasás rögös útján.\r\n\r\nNa de miért is jó nekünk?\r\n\r\n\r\n\r\nPróbáltunk már komolyabb applikációt írni JS-ben, pl. ES5 alatt? Hány perc után fogott el a sírógörcs? Persze levetk&#337;zhetjük a logikát, hogy backendesek szívjanak (viva la vékonykliens), de ha az éppen node.js, akkor bizony ígyis-úgyis szembesülnünk kell a ténnyel, hogy szükségünk van némi segítségre, hogy átlássuk a dolgokat. Bevezethetünk module loadereket, szétdarabolhatjuk az applikációt, viszont akkor a sok kis apró elemet lesz nehéz fejben összekötni, komolyabb változtatásokat végigvezetni azokon egy gombnyomással. Mégis hogy segíthet nekünk a típusok bevezetése? Nos az els&#337; ilyen lépés az pont ez, ugyanis ezáltal sokkal jobb kódkiegészítést kapunk, kontextusba ill&#337;t, a másik a refaktoring lehet&#337;sége, lévén az IDE végig tudja követni, hogy milyen objektumok merre járnak, adott tagváltozók nevét nem hasraütésszer&#369;en kell kitalálnia, de erre még kés&#337;bb visszatérünk.\r\n\r\nNa és miért is kell? Azért, mert ez a szomorú jöv&#337; több helyen is hasznát vesszük. Az Angular2 esetében (mondjuk itt nem csak ez az egy opció) úgy mint az Ionic 2 esetében is, de ha valakit a játékfejlesztés inkább érdekel (itt nyerek olvasókat, jeee! ), akkor ott C# mellett a TypeScript is opció, amiben scriptjeinket írhatjuk.\r\n\r\nNa de sok volt a beszéd, inkább nézzük meg mi is ez az egész!\r\n\r\nAhhoz, hogy m&#369;ködjön a dolog, els&#337; körben szükségünk lesz a typescript npm csomagjára:\r\nnpm install -g typescript\r\nÉs bumm, kész is vagyunk, mehetünk haza!\r\n\r\nSajnos ez nem lesz ilyen egyszer&#369;, ezért most mindenki platformtól függ&#337;en keressen valami olyan IDE-t, ami támogatja a typescriptet. WebStorm, Visual Studio, VS Code, stb. elég sok editor támogatja már. A példákban a képek a csodás VS Code-ból valóak lesznek. Emlékszünk még az ES6 syntaxra? Sokban hasonlítani fogunk arra:\r\nclass Starter {\r\n}\r\nEzt mentsük le egy starter.ts fájlba, majd fordítsuk le és nézzük mi is lesz bel&#337;le!\r\ntsc starter.ts\r\nAlapesetben ugyanoda fogja fordítani a fájlokat, de kés&#337;bb majd megnézzük, hogy is lehet konfigurálni a typescript compilerét.\r\nA generált fájl a starter.js lesz:\r\nvar Starter = (function () {\r\n function Starter() {\r\n }\r\n return Starter;\r\n}());\r\nHát nem mondanánk valami szépnek, ugye? Na de az imént típusokról volt szó, nemde? Akkor nézzük csak mir&#337;l is volt szó!\r\nclass Starter {\r\n private startingNumber : number;\r\n \r\n public constructor(startingNumber : number) {\r\n this.startingNumber = startingNumber;\r\n }\r\n}\r\nHirtelen felvettünk pár plusz elemet a dologba. El&#337;ször is hozzáadtunk az osztályunkhoz egy privát fieldet, ami number típusú, létrehoztunk egy konstruktort, ami ezt beállítja. Nézzünk mi is lesz ebb&#337;l a generált kódban:\r\nvar Starter = (function () {\r\n function Starter(startingNumber) {\r\n this.startingNumber = startingNumber;\r\n }\r\n return Starter;\r\n}());\r\nÖöö.. hol a privát field, hol vannak a típusok? Nos a helyzet az, hogy a javascriptben nincsenek a access modifierek, ennélfogva azokat nem lehet ábrázolni ott. Tehát ott nem fognak megjelenni. Típusok sincsenek, tehát azok se jelennek meg.\r\n\r\nAkkor mégis mi értelme ennek?\r\n\r\n\r\n\r\nPróbáljuk meg pl. stringet átadva a konstruktornak példányosítani az osztályunkat:\r\nstarter.ts(8,25): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.\r\nHát igen, a compiler bizony beszól, hogy nettó f*szság amit épp tenni próbálunk (ennek ellenére persze lefordítja az egészet...), valamint az IDE is észreveszi, hogy valami nem kóser. Akkor most nézzük az access modifiereket! A startingNumber ugye privát, ennélfogva nem kéne kívülr&#337;l elérni, nemde?\r\n\r\nHát nem kell félteni a rendszert, ezért is ugyanúgy beszól. Hmm, így talán lehet normális rendszereket tervezni? Azt már látjuk, hogy az access modifiereket figyelembe veszi a rendszer, valamint lehet classokat deklarálni.\r\n\r\nMi az helyzet az interfészekkel?\r\n\r\nNa ez egy kicsit más tészta, mint amit más nyelvekben láthattunk, ugyanis az interfészeket nem kell implicit implementálnunk, elég ha a bels&#337; szerkezete hasonló:\r\ninterface Rucsok {\r\n hoursSlacked : number;\r\n}\r\n\r\nclass Starter { // kicsit átformáltuk a dolgokat\r\n private rucsok : Rucsok;\r\n public constructor(rucsok : Rucsok) {\r\n this.rucsok = rucsok;\r\n }\r\n}\r\n\r\nvar rucsok = {hoursSlacked : 6}; // anonym object, de ugyanazokkal a fieldekkel rendelkezik, mint a Rucsok interfész, ennélfogva kompatibilis\r\n\r\nvar start = new Starter(rucsok);\r\nA fentiekben kissé átírtuk a dolgokat, létrehoztunk egy Rücsökinterfészt, aminek lett egy number típusú fieldje. Ezt várja konstruktorban a Starter. Mi azonban csak egy szimpla anonym objectet adunk át, aminek a fieldjei ugyanazok, így mégis megeszi azt.\r\n\r\nHa lefordítjuk, láthatjuk, hogy az interfészünk sehol sem szerepel, mert ez csak a typescriptben létezik, valamint a funkciója is némileg eltér más nyelvekben alkalmazott interfészekt&#337;l.\r\n\r\nNa de ha már típusok, milyen típusokat ismerünk?\r\n\r\nboolean:\r\nlet b : boolean = true;\r\nHé, álljunk csak meg egy szóra! Mi ez a let? hát nem a var kulcsszóval tudunk változót deklarálni? De igen, azonban a var scopingja nem az igazi, ennélfogva ha ún. block scopingot szeretnénk a változónknak, akkor a let kulcsszóval érdemes azt tenni. Kés&#337;bb még kitérünk a kett&#337; közti különbségre.\r\n\r\nnumber:\r\nlet workHours : number = 8;\r\nA number, ugyanúgy ahogy a sima JavaScriptben, floating point, annyi, hogy a sima decimális és hexa forma mellett oktális és bináris formában is megadhatjuk azt.\r\n\r\nstring:\r\nlet joker : string = \"Why so serious?\";\r\nEz még semmi extra, viszont bejöttek az ún. template stringek, amik az eddigi összef&#369;zögetést hivatottak kiküszöbölni. Ezeket nem simple/duble quote-al tudjuk meghatározni, hanem az ún. backquote-al (`). Bennük változókat is meghatározhatunk, mégpedig a ${ expression } szintaxissal. A másik plusz, hogy több soron átívelhetnek, ellenben az eddigi string literálokkal, amiket soronként le kellett zárni és + jelekkel összef&#369;zni.\r\ntemplate string:\r\n\r\nlet quote : string = `- ${ joker },\r\n let's put a smile on this face!`;\r\nEddig még semmi varázslat nem történt, nézzünk a tömbökkel mi a helyzet?\r\n\r\narray:\r\n\r\nNa most hasonlóan pl. a C#-hoz, tömböt a []-val fogjuk jelölni, ígye:\r\nlet fibonacci : number[] = [0, 1, 1, 2, 3, 5, 8];\r\nA másik megadási mód már sokkal fancybbnek hat, mégpedig generikus Array objektumként:\r\nlet fibonacci : Array<number> = [0,1,1,2,3,5,8];\r\nBizony, lesznek itt generikusok is, de erre majd még visszatérünk!\r\ntuple:\r\n\r\nNa ez miféle csodabogár?\r\n\r\nEbben az esetben egy olyan tömböt szeretnénk deklarálni, amiben bizonyos indexekhez fix típust rendelünk. Például akarunk egy string-string párost:\r\nlet entry : [string, string];\r\n\r\nentry = [\"Star\", \"Wars\"]; // funktzioniert\r\n\r\nentry = [\"Star Wars\", 7]; // csecsre fut\r\n\r\n\r\nAmikor kikérjük az elemet az adott indexen, akkor a fordító tudni fogja, hogy milyen típust is ad vissza. Ha olyan elemet hívunk meg, amit nem határoztunk meg, akkor egyfajta uniót képez a típusok között:\r\nlet entry : [string, number];\r\n\r\nentry[5] = \"yepp\"; // string, belefér\r\n\r\nentry[5] = 0b001; // number, belefér\r\n\r\nentry[5] = true; // csecsre fut, mert (string|number) constraintnek nem felel meg\r\nA típus uniókba egyel&#337;re ne menjünk bele, az egy elég advanced topic.\r\n\r\nenum:\r\n\r\nHohohó, lassan már Java ez, nem is JS, nemde?\r\n\r\nEz egy teljesen új típus, ami nem létezik JavaScript alatt, ezért egy furcsa objektumszerkezettel írja le fordítás után:\r\nenum Situation {BAD, WORSE, WORST}\r\n\r\nlet szitu : Situation = Situation.BAD;\r\nEbb&#337;l a fordítás után a következ&#337; JS kód keletkezik:\r\nvar Situation;\r\n(function (Situation) {\r\n Situation[Situation[\"BAD\"] = 0] = \"BAD\";\r\n Situation[Situation[\"WORSE\"] = 1] = \"WORSE\";\r\n Situation[Situation[\"WORST\"] = 2] = \"WORST\";\r\n})(Situation || (Situation = {}));\r\nvar szitu = Situation.BAD;\r\nAzért így történik, mert nem csak a kulcs alapján, de index alapján is elérjük az értékeit egy enumnak. Alapesetben a hozzárendelt értékek 0-tól indexekl&#337;dnek, de mindezt felülbírálhatjuk:\r\nenum Situation {BAD = 42, WORSE = 75, WORST = 88 }\r\nA fentiek f&#337;leg ott használhatóak, ahol már meglév&#337; TypeScript kóddal lépünk kapcsolatba, azonban a legtöbb esetben sima JS third party library-kat és hasonlókat is használunk, amikhez nincs ún. definition fájl (majd err&#337;l is beszélünk) és ennélfogva az ott szerepl&#337; típusokról g&#337;zünk sincs. Ekkor jön képbe az ún. any típus.\r\n\r\nEzt akkor használjuk, amikor az adott változó típusellen&#337;rzését a compiler figyelmen kívül hagyja:\r\nlet someJQueryStuff : any = $(\"#whatever\");\r\nsomeJQueryStuff = 36;\r\nsomeJQueryStuff = \"how about no?\";\r\nJól látható, hogy bármit is rendelünk hozzá, nem fog beszólni a compiler. Itt ránkbízza a dolgot a compiler, tehát észnél kell lenni, hogy mi is történik. Tömbökre is alkalmazható:\r\nlet couldBeAnything : any[] = [5, \"string\", false];\r\nAkkor most jöjjön, ami pont az any ellenkez&#337;je, a void \"típus\":\r\n\r\n\r\n\r\n\r\nAmikor egy metódusunk nem tér vissza semmivel, akkor alkalmazzuk a void típust. Ezt nem lehet változóhoz rendelni, hanem függvény visszatérési értéknek:\r\nfunction wontReturnAnything() : void {\r\n return;\r\n}\r\nHa megpróbáljuk mégis meger&#337;szakolni a dolgot, akkor biza hibát dob:\r\n\r\nVannak még más speciális típusok ha visszatérési értékekr&#337;l van szó. Az egyik ilyen pl. a never lesz. Ez a VS Code által használt TypeScriptben még nem lesz benne, ezért felül kell csapni a használt SDK-t. A never típust akkor használjuk, amikor a metódusunk vége unreachable. Ez nem egy gyakori példa, ezért vegyük át az eseteket:\r\n\r\nAz egyik ilyen, mikor kivételt dobunk:\r\nfunction wontReturnEver() : never {\r\n throw new Error(\"Oops\");\r\n}\r\nA másik eset a végtelen ciklus:\r\nfunction wontReturnEver() : never {\r\n while(true) {\r\n // how cool is that?\r\n }\r\n}\r\nRafkós a rendszer, mert nem lehet könnyen átverni:\r\n\r\n\r\n\r\nA harmadik eset pedig amikor ezen metódusokat hívjuk és ezek visszatérési értékét adjuk vissza:\r\nfunction noShitSherlock() : never {\r\n return wontReturnEver();\r\n}\r\nEgyre \"jobb\" programozási gyakorlatokat láthatunk, nem? Azért nem kell feltétlenül végtelen ciklusokat használni, hogy szerepelhessen a kódunkban a never, oké? :)\r\n\r\nA voidhoz hasonlóan akad még két másik típus, ami önmagában nem valami hasznos, az undefined és a null.\r\n\r\nAlapesetben a null és az undefined altípusai az összes más típusnak, ennélfogva null-t vagy undefined-ot hozzárendelhetünk pl. egy stringhez vagy array-hez akár.\r\nlet test : number[] = null;\r\nlet test2 : number[] = undefined;\r\nEz emlékeztethet minket az er&#337;sen típusos nyelveknél megszokottakra, ugye? Jó kis null checkek a metódusok elején, netán Optional osztályok. Kés&#337;bb majd még lesz szó az ún. strictNullChecks flagr&#337;l.\r\n\r\nType cast\r\n\r\nA név kissé becsapós, mert itt semmi runtime ráhatása nem lesz a dolognak, csak a compiler fogja végezni a dolgot. Ezzel tudjuk elérni, hogy a TypeScriptre ráer&#337;szakoljuk, hogy ez a változó bizony ez a típus. Na de nézzük a szintaktikáját a dolognak:\r\n\r\nVegyünk egy alapesetet, hogy meghákoljuk a polimorfizmust:\r\nexport class Rucsok{\r\n public randomNumber : number;\r\n}\r\n\r\nlet obj : Object = new Rucsok();\r\nEzután ha megpróbálunk valamit csinálni az obj változón, akkor bizony nem látunk semmit a Rucsok classból, pedig annak van egy publikus tagváltozója, ejnye!\r\n\r\n\r\n\r\n \r\n\r\nNa akkor most vessük be a type assertion-t!\r\nlet rnd : number = (obj as Rucsok).randomNumber; // ez az as kulcsszóval m&#369;köd&#337; \r\n\r\nrnd = (<Rucsok>obj).randomNumber; // ez pedig a kifordított generikus módszer\r\nIsmét kihangsúlyoznám, hogy ennek semmi runtime hatása nem lesz, a generált kódban:\r\nvar rnd = obj.randomNumber;\r\nrnd = obj.randomNumber;\r\nnem szerepel majd a dolog, csak compile time segít.\r\nModulok\r\nSajna arra nincs elég hely itt, hogy végignyálazzuk a TypeScript összes újdonságát, ezért most fókuszáljunk inkább azokra a részekre, amik minden esetben el&#337;jönnek majd a vele való munka során. Az egyik ilyen a modulok kérdése lesz majd. Az ES2015-ben már vannak modulok, ezt pedig a TypeScript is hozza magával. Az egyik legfontosabb tudnivaló, hogy ezek a modulok saját scope-al rendelkeznek, ennélfogva nem fogják beszennyezni a globális scope-ot, kivéve ha exporttal kiexportáljuk azt és importtal pedig hivatkozunk rá. A többit kívülr&#337;l nem érjük el, ellenben a kiexportált osztályban, stb. hozzáférünk a modul elemeire, amib&#337;l kihúztuk azt. Ezt fogjuk fel amolyan package private-nek (Java-sok szeme most felcsillan ).\r\nExportot alkalmazhatunk bármilyen deklarációra, classra, aliasra, interfészre, változóra\r\nEz az import nem ugyanaz, mint amit a module loaderek végeznek. A module loaderek felel&#337;sek hogy runtime behúzzák a függ&#337;ségeket miel&#337;tt futtatják a kódot. Node.JS-ben ilyen a CommonJS és weben pedig a require.js.\r\n\r\nA TypeScript többféle module loaderhez képes kompatibilis kódot el&#337;állítani, így commonjs, amd, system, ES6, ES2015, umd-re. Na de mi is ez az egész?\r\n\r\nKicsit rendszerezzük a projektünket, hozzunk létre egy src mappát és egy dist mappát is. El&#337;bbi fogja tartalmazni a ts, utóbbi a js fájlokat. A projektünk gyökerében pedig hozzunk létre egy tsconfig.json-t. Ez tartalmazza majd a konfigurációt ami szerint a compiler dolgozik majd.\r\n\r\nA konfig fájl tartalma legyen a következ&#337;:\r\n{\r\n \"include\": [\r\n \"src/**/*\"\r\n ],\r\n \"compilerOptions\": {\r\n \"outDir\": \"dist\",\r\n \"module\": \"amd\"\r\n }\r\n}\r\nItt beállítjuk, hogy a generált fájlokat a dist mappába fogja tenni, AMD szerint hozza létre &#337;ket és az src mappából rekurzívan minden fájlt behúz. Hozzunk létre az src mappában egy some-module.ts-t:\r\nimport {AnotherModule} from \"./another-module\";\r\n\r\nexport class SomeModule {\r\n private property : AnotherModule;\r\n\r\n public constructor(dependency : AnotherModule) {\r\n this.property = dependency;\r\n }\r\n}\r\nValamint az általa hivatkozott another-module.ts-t:\r\nexport enum AnotherModule {\r\n NOTHING, HERE\r\n}\r\nVégül az &#337;ket használó main.ts-t:\r\nimport {AnotherModule} from \"./another-module\";\r\nimport {SomeModule} from \"./some-module\";\r\n\r\nvar mod : SomeModule = new SomeModule(AnotherModule.NOTHING);\r\nEzután nézzük mit sikerült a rendszernek forgatnia bel&#337;le!\r\n\r\nsome-module.js\r\ndefine([\"require\", \"exports\"], function (require, exports) {\r\n \"use strict\";\r\n var SomeModule = (function () {\r\n function SomeModule(dependency) {\r\n this.property = dependency;\r\n }\r\n return SomeModule;\r\n }());\r\n exports.SomeModule = SomeModule;\r\n});\r\nEbben a modulban ugyan függünk az another-module-tól, azonban itt mégsem jelenik meg, az mert nem használjuk azt direktben, ezért nincs szükség rá. Jól látható, hogy define blockokba csomagolta a tartalmat a compiler és a require/exports modulokat default beleinjektálja. Ez azért fontos, hogy más modulokat is be tudjunk húzni vagy épp a miénket exportálni.\r\n\r\nanother-module.js\r\n\r\ndefine([\"require\", \"exports\"], function (require, exports) {\r\n \"use strict\";\r\n (function (AnotherModule) {\r\n AnotherModule[AnotherModule[\"NOTHING\"] = 0] = \"NOTHING\";\r\n AnotherModule[AnotherModule[\"HERE\"] = 1] = \"HERE\";\r\n })(exports.AnotherModule || (exports.AnotherModule = {}));\r\n var AnotherModule = exports.AnotherModule;\r\n});\r\nItt se jelenik meg semmilyen másik modul, lévén itt nem is használunk mást, csak kiexportáljuk az enumot amit deklaráltunk.\r\n\r\nmain.js\r\ndefine([\"require\", \"exports\", \"./another-module\", \"./some-module\"], function (require, exports, another_module_1, some_module_1) {\r\n \"use strict\";\r\n var mod = new some_module_1.SomeModule(another_module_1.AnotherModule.NOTHING);\r\n});\r\nNa itt már látszik, hogy valóban használjuk a két létrehozott modult. Aliasokat képez a compiler és azokat használva tudjuk behúzni &#337;ket. Na de miért kell még az aliason belül kulcsokat is képezni? Nos részben azért, mert egy ilyen modulból több elemet is kiexportálhatok és be is importálhatok több elemet. Az importok során a beimportálandó elem neve meg kell egyezzen a kiexportált elem nevével, DE! aliasokat alkalmazhatunk, ahogy azt más nyelveknél már megszoktuk. Tehát:\r\nimport {SomeModule as some} from \"./some-module\";\r\nimport {AnotherModule as dep} from \"./another-module\";\r\n\r\nlet stuff : some = new some(dep.HERE);\r\nLáthatjuk, hogy aliassal más néven tudjuk használni a beimportált elemeket, ha úgy tartja kedvünk.\r\n\r\nHa nem csak egy elemet akarunk, akkor a *-al behúzhatjuk a modulban exportált összes deklarációtegy alias alá. Ilyenkor az alias alatti kulcsokkal férünk hozzá az egyes elemekhez:\r\nimport * as some from \"./some-module\";\r\nimport * as dep from \"./another-module\";\r\nlet stuff : some.SomeModule = new some.SomeModule(dep.AnotherModule.HERE);\r\n \r\nNa de mi a helyzet akkor, amikor egy third party libet használnék, ami sima JavaScript?\r\nAhhoz, hogy ezeket használni tudjuk, a TypeScript számára le kell írjuk annak a szerkezetét, a publikus API-ját, amit használni akarunk. Szerencsénkre elég sok ismert libhez készültek már ilyen leírók, amit .d.ts kiterjesztés&#369; fájlokban írunk le. Hasonlóan m&#369;ködnek, mint a C/C++-ból is ismert header fájlok. Az ilyen fájlokat \"ambient\" deklarációknak nevezzük, mert nem tartalmazzák az implementációt.\r\n\r\nNézzünk egy példát rá!\r\n\r\nNode.js-ben a legtöbb funkció használatához be kell importálnunk az adott modult. Rengeteg ilyen van, ezért ahelyett, hogy mindnek létrehoznánk a saját kis leíróját, inkább egy nagyba gyúrjuk azt össze.\r\ndeclare module \"url\" {\r\n export interface Url {\r\n protocol?: string;\r\n hostname?: string;\r\n pathname?: string;\r\n } \r\n export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url; \r\n} \r\ndeclare module \"path\" {\r\n export function normalize(p: string): string;\r\n export function join(...paths: any[]): string;\r\n export var sep: string; \r\n}\r\nEzt mentsük le egy node.d.ts fájlba. Természetesen ez csak egy töredéke a node.js API-jának, pusztán a példa kedvéért.\r\n\r\nEzután már tudunk rá hivatkozni az ún. triple slash használatával:\r\n/// <reference path=\"node.d.ts\" />\r\nimport * as URL from \"url\";\r\nlet myUrl = URL.parse(\"http://www.typescriptlang.org\");\r\nA definition fájl behúzása után ugyanúgy m&#369;ködik, mint egy TypeScript fájl.\r\n\r\nSzerencsénkre nagyon sok libhez már van kész definition fájl, így nem kell azt megírnunk magunknak. Többet err&#337;l itt.\r\n\r\nÓrákon át lehetne pötyögni a TypeScriptr&#337;l, de nem az a cél, csak egy kis betekintés, miel&#337;tt beleugrunk az Angular 2-be TypeScript alapokon! Tehát egyel&#337;re legyen elég ennyi, ha pedig bármi észrevétel van, a lenti komment szekció bárki rendelkezésére áll!",
 "post_id": "1",
 "post_date": "2016-09-25 14:02:30",
 "display_name": "Tacsiazuma",
 "author_id": "1",
 "_links": {
 "self": {
 "href": "http://localhost:3000/posts/1"
 }
 }
}
```

De tegyük fel, hogy ezt másoltátok be, akkor az oldal valahogy így kellene fessen:[![Selection_070](assets/uploads/2016/12/Selection_070.png)](assets/uploads/2016/12/Selection_070.png)

Most itt megállunk, hagyjuk emészteni a dolgot, a következő alkalommal pedig megnézzük, hogy különböző view-k létrehozásával wordpress DB felett hogy is tudjuk ezt kiszolgálni az angular 2 számára!

</body>
