---
id: 1319
title: 'Angular 2 TypeScript módra &#8211; 1. rész'
date: '2016-10-10T21:32:32+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1319'
permalink: /2016/10/10/angular-2-typescript-modra/
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
image: 'assets/uploads/2016/10/09202314/angular2-825x510-1.png'
categories:
    - Frontend
    - JavaScript
tags:
    - angular
    - 'angular 2'
    - frontend
    - javascript
    - typescript
---

Az [előző]({{ site.url }}/2016/09/25/hypescript/) cikkben kitértünk arra, hogy mi is az a TypeScript és miért is lehet a hasznunkra <del>és, hogy eggyel növelhessük végre a használt tool-ok és supersetek sokaságát, mert ettől JS a JS</del>.

A [múltkori]({{ site.url }}/2016/09/18/cross-platform-mobilosodas-2-resz/) részekben egy szimpla todo appot gyártottunk, de most valami komolyabbra kellene lőnünk, hogy ne csak egy sima CRUD-ban teljesedjen ki a tudásunk. Mivel nem akarom kétszer leírni ugyanazt, ezért a komolyabb implementáció a következő cikkben lesz, Ionic 2 segítségével, ahol már a külseje is olyan lesz az appunknak, ahogy annak lennie kell és nem torkollunk CSS-be, úgyhogy most vessük magunkat bele a sürűjébe!

[![angular2-825x510](assets/uploads/2016/10/angular2-825x510.png)](assets/uploads/2016/10/angular2-825x510.png)

Most jön az a rész, amivel minden JS alapú dolog kezdődni szokott, úgyhogy mindenki tegye fel a[ Node.JS](https://nodejs.org/en/)-t.

Hozzuk létre a projektünk könyvtárát, majd abban szükségünk lesz pár konfig fájlra mielőtt bármihez kezdhetnénk, mégpedig 4 fájlra. Ezeket egyesével kianalizáljuk majd.

Mivel TypeScriptben fogjuk írni a dolgokat, ezért szükségünk lesz a hozzá szükséges konfigurációra, **tsconfig.json** formájában:

```
<pre data-language="javascript">{
 "compilerOptions": {
 "target": "es5",
 "module": "commonjs",
 "moduleResolution": "node",
 "sourceMap": true,
 "emitDecoratorMetadata": true,
 "experimentalDecorators": true,
 "removeComments": false,
 "noImplicitAny": false
 }
}
```

Megadjuk, hogy biza ES5-re szeretnénk fordítani a kódot, mégpedig commonJS modulok mentén. Lesz sourcemap, használni akarjuk a decoratorokat és szeretnénk, ha megjelennének a sourceban. A kommenteket ki akarjuk törölni a kész JS-ből, valamint szeretnénk ha figyelne, ha valamelyik változónál/paraméternél kimaradt a típus meghatározása.

Mivel az alkalmazásunk függőségei nem TypeScriptben lesznek, ezért azokat nem árt megadni, ún. definition fájlban, ami alapján a TypeScript code completiont nyújt számunkra, ami egy igazán király dolog. Ezt a typings.json-ben fogjuk megadni:

```
<pre data-language="javascript">{
 "globalDependencies": {
 "core-js": "registry:dt/core-js#0.0.0+20160725163759",
 "jasmine": "registry:dt/jasmine#2.2.0+20160621224255",
 "node": "registry:dt/node#6.0.0+20160909174046"
 }
}
```

Láthatjuk, hogy egy központi registry-ből húzzuk le azokat, verzió és timestamp alapján. Kell nekünk a node és jasmine a tesztekhez, valamint a core-js polyfillek.

> **Mik azok a polyfillek?** A polyfillek teszik lehetővé, hogy olyan API-t használjunk, ami még az adott böngészőben nem támogatott. Általában arról szólnak, hogy ellenőrzik, hogy az adott böngésző támogatja-e az adott funkciót, ha igen, akkor szimplán annak delegálja a feladatot, ha nem, akkor a saját implementációját használja. Igazából ez nem más, mint egy adapter.

A következő json a `package.json` lesz, ami az **npm** konfigjáért felel:

```
<pre data-language="javascript">{
 "name": "angular-quickstart",
 "version": "1.0.0",
 "scripts": {
 "start": "tsc && concurrently \"tsc -w\" \"lite-server\" ",
 "lite": "lite-server",
 "postinstall": "typings install",
 "tsc": "tsc",
 "tsc:w": "tsc -w",
 "typings": "typings"
 },
 "license": "ISC",
 "dependencies": {
 "@angular/common": "~2.0.1",
 "@angular/compiler": "~2.0.1",
 "@angular/core": "~2.0.1",
 "@angular/forms": "~2.0.1",
 "@angular/http": "~2.0.1",
 "@angular/platform-browser": "~2.0.1",
 "@angular/platform-browser-dynamic": "~2.0.1",
 "@angular/router": "~3.0.1",
 "@angular/upgrade": "~2.0.1",
 "angular-in-memory-web-api": "~0.1.1",
 "bootstrap": "^3.3.7",
 "core-js": "^2.4.1",
 "reflect-metadata": "^0.1.8",
 "rxjs": "5.0.0-beta.12",
 "systemjs": "0.19.39",
 "zone.js": "^0.6.25"
 },
 "devDependencies": {
 "concurrently": "^3.0.0",
 "lite-server": "^2.2.2",
 "typescript": "^2.0.3",
 "typings":"^1.4.0"
 }
}
```

Na most a függőségeket nem akarom felsorolni, mert akkor estig itt maradunk, viszont a scripts részre azért térjünk vissza. Ezek ugye az npm részei, lévén a `package.json`-ben találjuk őket, ennélfogva a fenti "start" igazából egy

```
<pre data-language="shell">npm start
```

parancsra hallgat majd. Amikor mi ezt kiadjuk, lefordítja a kódot a TypeScript compiler, jelen konfigurációval ugyanoda, ahol a` .ts` fájljaink is vannak, majd elindítja konkurrensen a TypeScript compilert watch módban, azaz ha módosítunk a fájlokon, akkor újrafordítja azokat, valamint elindítja [John Papa node.js szerverét](https://github.com/johnpapa/lite-server), ami websocketen át kapcsolatban van a böngészővel és ha változás történik a fájlokban, frissíti az oldalt, így még egy F5-öt is megspórol nekünk. Ha az `npm lite`-ot használjuk, akkor nem fordítja le a dolgokat és később se figyel a ts fájlokra, viszont ugyanúgy elindítja a node szervert és a css/js módosítások ugyanúgy triggerelik a böngésző frissülését. A `postinstall` akkor jöhet jól, ha valamilyen anomália miatt (ami JavaScriptről lévén szó, nem ritka) nem jönnének le a típusdefiníciós fájlok.

Na most ez eddig szép és jó, de nem ártana valamit kiszolgálni, nemde?

Ahhoz, hogy ebből legyen is valami, a SystemJS module loadert fogjuk használni, aminek szintén lesz egy config fájlja, de remélhetőleg nem fog senkit elriasztani a dolog ettől, ugye?

Az emlegetetett fájl így néz ki:

```
<pre data-language="javascript">(function (global) {
 System.config({
 paths: {
 // ezt használjuk később aliasként, mindent az npm-ről szedünk
 'npm:': 'node_modules/'
 },
 // itt lesznek az egyes modulok a konkrét fájlokhoz mappelve
 map: {
 // az applikációnk az app folderben lesz
 app: 'app',
 // angular bundles
 '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
 '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
 '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
 '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
 '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
 '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
 '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
 '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
 // egyéb libek
 'rxjs': 'npm:rxjs',
 'angular-in-memory-web-api': 'npm:angular-in-memory-web-api',
 },
 // ez a rész mondja el a SystemJS-nek, hogy miként is töltse be azokat a fájlokat, amiknek nincs kiterjesztése/fájlneve
 packages: {
 app: {
 main: './main.js',
 defaultExtension: 'js'
 },
 rxjs: {
 defaultExtension: 'js'
 },
 'angular-in-memory-web-api': {
 main: './index.js',
 defaultExtension: 'js'
 }
 }
 });
})(this);
```

Akkor most... mi van?[![wtf](assets/uploads/2016/10/wtf.jpg)](assets/uploads/2016/10/wtf.jpg)

Ne aggódjunk, ez se lesz végül bonyolultabb, mint a requireJS volt anno és most nem is megyünk bele a mélységeibe. Más module loadert is lehet használni egyébként, lévén TypeScriptben íródott a dolog, meghatározhatjuk milyen kimenetet is szeretnénk.

Először is felhúzunk egy alias-t a `node_modules`-ra, hogy ne kelljen mindig beírni, így már csak `npm`-ként tudunk rá hivatkozni. A `@` ne tévesszen meg senkit, ha belenavigálunk a `node_modules` mappába, ez fizikailag is így van, nincs jelentése itt. Behúzzuk a core-t, általános dolgokat, a HTML compiler részét, a böngésző platformhoz szükséges dolgokat, routert, formokat és még sok mást, amikre jelenleg még nem feltétlenül lesz szükségünk, de később jó lesz inkább csak magát a kódot írni, mint libeket keresgélni.

A packages részben meghatározza azokat az elemeket, amiknél nem egy összekonkatenált fájlra hivatkozunk, hanem egy elemre a csomagból. Az app package, maga az alkalmazásunk fő belépési pontjának a main alá megadtuk a `main.js`-t, amit az `app/main.js`-ben fog keresni így. Az `app` részét a map-ből szedi, emlékszünk még? 🙂

Az `angular-in-memory-web-api`-t rámappeltük az `npm:angular-in-memory-web-api`-ra, fő belépési pontja az index.js, tehát a `node_modules/angular-in-memory-web-api/index.js`-t fogja keresni.

Most hogy szétkonfiguráltuk az egészet, akkor telepítsük fel azt a jópár függőséget, amit megadtunk, mielőtt mindenkinek elmenne a kedve a dolgoktól:

```
npm install
```

A fél internet lejött, most elkezdhetjük megírni a saját implementációnkat. Az `app` mappában fogunk dolgozni, hozzuk is létre azt és hozzunk benne létre egy `app.module.ts` nevű fájlt:

```
<pre data-language="javascript">import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
 imports: [ BrowserModule ]
})
export class AppModule { }
```

Ez már azért annyira nem szemidegen, ugye? Először is behúzunk két alapvető dolgot. Az `NgModule` segítségével beimportáljuk a `BrowserModule`-t, ami ahhoz szükséges, hogy alkalmazásunk böngészőben működjön. Ezután definiálunk egy üres `AppModule`-t és kiexportáljuk, hogy később importtal be lehessen azt húzni. Minden angular applikációnak lesz egy gyökérmodulja, ami jelen esetben ez lesz. Később újabb angular modulokat fogunk még használni (ha már definiálva vannak a systemjs konfigban), de jelenleg nincs még rájuk szükségünk, ezért feleslegesen nem húzzuk be azokat.

A következő lépés, hogy egy komponenst is hozzáadjunk. A komponensek kisebb, alapvető építőelemei az alkalmazásunknak, amik az angular régi verziójában leginkább a route-okhoz kötött kontrollerek megfelelői lehetnének. Ezt most szimplán az `app.component.ts` fájlba írjuk:

```
<pre data-language="javascript">import { Component } from '@angular/core';
@Component({
 selector: 'my-app',
 template: '<h1>My First Angular App</h1>'
})
export class AppComponent { }
```

Az első lépés a szokásos, a Component decoratort behúzzuk az angular core-ból, hogy később tudjuk azt használni. Ezután ennek segítségével összekötjük komponensként jelöljük az osztályunkat, valamint a `my-app `css-selector tartalmát a template-el, amit itt megadtunk. Itt statikus templatet használunk, így semmi más nem történik, mint az behelyettesítődik a selectorra machelő tagek közé.

Na várjunk csak.. decorator? Az nem valami [pattern]({{ site.url }}/2016/04/28/diszitsuk-fel-wrappert/)? Meg mitől decorator, a `@` miatt?

> A JavaScript decoratorok a TypeScript egy kisérleti feature-je, ami még nincs jelen a JavaScriptben, csak javaslat formájában, ennélfogva még bármi változhat rajta. A decoratorok egy speciális deklaráció, amit hozzá lehet csatolni osztálydefinícióhoz, metódushoz, propertyhez, accessorhoz, stb. Tehát a fenti `@Component` és `AppComponent` úgy tűnhet, hogy teljesen különálló, valójában összetartoznak, mert az AppComponentet dekoráljuk a @Componenttel. Az ilyen decoratorok mindenképpen `@`-al kezdődnek és egy metódus van a háttérben, ami meghívódik majd az információval, amit átadtunk neki, jelen esetben, mivel class decoratorról van szó (mivel class elé írtuk azt), a decorator az adott osztály konstruktora köré épül, így módosíthat, cserélhet benne dolgokat. Runtime mikor meghívódik a decorator function, akkor a "díszített" osztály konstruktorát kapja meg mint paraméter.
> 
> **Igazi feketemágia, ugye?**

Mivel kiexportáltuk az Appcomponentet, ezért máshol tudjuk azt használni. Az iménti AppModuleban még nem hivatkoztunk rá, lévén még nem volt mire, így most tegyük meg és editáljuk az app.module.ts-t:

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
@NgModule({
 imports: [ BrowserModule ],
 declarations: [ AppComponent ],
 bootstrap: [ AppComponent ]
})
export class AppModule { }
```

Akkor nézzük szépen mi is változott. Az NgModule annotációt behúztuk, valamint a BrowserModule se változott, viszont felkerült két új elem a decorator annotációnkba, mégpedig a declarations és bootstrap, ahova az imént létrehozott komponensünket fel is vettük. Ugye importáltuk a BrowserModulet, ami egy helper és minden böngészőben futó apphoz kelleni fog, alapvető service-eket és direktívákat kapunk vele. A declarationsel tudjuk beregisztrálni az általunk írt modulokat, ami jelen esetben az AppModule lesz, a bootstrap pedig megjelöli, hogy mely modul lesz ún, bootstrap modul, ami azt eredményezi, hogy mikor az angular appunk beröffen, ennek a modulnak fogja átadni a DOM-ot, hogy a decorator által megjelelölt selectoron dolgozzon.

A gond az, hogy még mindig nem működik amit csináltunk, pedig az npm már lerántott 30.000 fájlt és már mi is írtunk vagy 7 fájlba, így nem ártana csinálni is valamit, nemde? Az angular appunk beröffentésére az `app/main.ts`-t szemeltük ki:

```
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
```

A bootstrap folyamat platformfüggő, ennélfogva nekünk a böngészős platformra lesz szükségünk, jelen esetben dinamikus JIT-compiler segítségével.

JIT? Mármint just-in-time compiler? Nem JavaScriptről beszélünk?

De bizony, csakhogy az Angular Compiler átalakítja az általunk írt kódot egy optimalizált Javascript kóddá. Amit írunk az nem lesz azonnal futtatható, lévén speciális html elemeket használunk, templateket, stb. A compiler fogja ezt a templatet beolvasni és összekapcsolni a hozzá tartozó komponens kódjával. Amikor a `platformBrowserDynamic`-ot használjuk, akkor az angular a böngészőben lefordítja a dolgokat és ezután indítja el az appunkat.

A másik opció az ún. statikus bootstrap, amikor ún. AoT (ahead-of-time) compilert használunk. Ezesetben az applikáció lebuildelésekor történik ez a compile, hogy a böngészőben már ilyesmire ne kerüljön sor. Ez gyorsabban indul, ami különösen fontos lehet mobilkészülékek esetében, de erről majd később.

Szóval elkészült az `app/main.ts` is, ahol kikérjük a platformot, majd átadjuk neki a modulunkat bootstrapelésre. Nem ártana az egészet elhelyezni egy index.html-ben, ugye?

```
<html>
 <head>
 <title>Angular QuickStart</title>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <!-- behúzzuk a szükséges libeket -->
 <!-- a régi böngészőkhöz szükséges polyfillek -->
 <script src="node_modules/core-js/client/shim.min.js"></script>
 <script src="node_modules/zone.js/dist/zone.js"></script>
 <script src="node_modules/reflect-metadata/Reflect.js"></script>
 <script src="node_modules/systemjs/dist/system.src.js"></script>
 <!-- SystemJS konfig -->
 <script src="systemjs.config.js"></script>
 <script>
 System.import('app').catch(function(err){ console.error(err); });
 </script>
 </head>
 <!-- az applikáció maga itt fog megjelenni -->
 <body>
 <my-app>Loading...</my-app>
 </body>
</html>
```

A fentiekben az történik, hogy a régi böngészők támogatásához szükséges polyfilleket behúzzuk, köztük a SystemJS-t is, majd bekonfiguráljuk azt és behúzzuk az app-ot. Ezt bekonfiguráltuk, hogy az `app/main.js`-t fogja hívni és innen indul majd a modulok betöltése szükség szerint. Ahhoz, hgoy az a fájl odakerüljön, ellenben nem ártana lefordítani az alkalmazást, hisz eddig TypeScriptben írtuk a fájljainkat:

```
npm start
```

Ezt a parancsot a projekt gyökerében kiadva elindul a lite-server, lefordulnak a TypeScript fájlok, valamint a böngészőt is megnyitja nekünk, a localhost:3000-re mutatva, ahol már ott csücsül az alkalmazásunk:

[![Selection_041](assets/uploads/2016/10/Selection_041.png)](assets/uploads/2016/10/Selection_041.png)

Mi is történt? Berántotta a SystemJS az `app/main.js`-t, valamint az is behúzott ilyen-olyan függőségeket. Behúzta a modult, ami modul pedig behúzta a komponensünket. A komponensben megadtuk, hogy a `my-app` CSS-selectort szeretnénk egy template-el behelyettesíteni. A modul behúzása után kikértük a platformot és bootstrapeltük az alkalmazást. Az angular munkába kezdett és a megkereste a my-app tag-et és kicserélte annak tartalmát az általunk megadott template-re. Ha pedig átírjuk a szöveget az `app.component.ts`-ben, valami másra és elmentjük, a TypeScript fájlokat újrafordítja és frissíti a böngészőablakunkat.

Most, hogy beröffent az app, nem ártana vele valamit kezdeni, hogy meg is jelenítsünk ezt-azt, viszont az már a következő cikk témája lesz. Akkor kitérünk arra, hogy is lehet megírni a múltkor Ionic segítségével kreált [todoAppot]({{ site.url }}/2016/09/18/cross-platform-mobilosodas-2-resz/) Angular 2-ben és összevetjük az Angular 1-el a szintaktikát! Azután pedig továbblépünk az Ionic 2 felé!

</body></html>