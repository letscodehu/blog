---
id: 1336
title: 'Angular 2 TypeScript módra &#8211; 2. rész'
date: '2016-11-08T23:15:17+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=1336'
permalink: /2016/11/08/angular-2-typescript-modra-2-resz/
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
image: 'assets/uploads/2016/10/09202318/wordpress-logo-notext-rgb.png'
categories:
    - Frontend
    - JavaScript
tags:
    - angular
    - 'angular 2'
    - angularjs
    - blog
    - javascript
    - typescript
---

Most, hogy megvan az angularos appunk alapja, nem ártana, hogy építsünk is valami értelmeset belőle. A todoAppokkal immáron Dunát lehetne rekeszteni, ezért most valami más irányba kellene elmenni. Legyen ez az irány például egy bloghoz készült frontend, kommentelési lehetőséggel, hogy ne csak megjelenítsük a dolgokat.[![wordpress-logo-notext-rgb](assets/uploads/2016/10/wordpress-logo-notext-rgb.png)](assets/uploads/2016/10/wordpress-logo-notext-rgb.png)

Lévén nem barbárok, hanem szoftverfejlesztők vagyunk, első lépésként megtervezzük az alkalmazásunkat... ha máshol nem is, de legalább fejben. Először is emlékezzünk vissza, hogy milyen építőelemeink is voltak? Modulok, valamint a kisebb komponensek. Használjuk az előző [cikkben]({{ site.url }}/2016/10/10/angular-2-typescript-modra/) létrehozott template-et, kiürített app mapppával. Mivel egy idő után zavaró lehet a sok .ts/.js/.js.map fájl, ezért szedjük ki a TypeScript fájljainkat a lefordított tartalomból és hozzunk létre egy src mappát. A másik lépés az lesz, hogy megmondjuk a TypeScript fordítónak, hogy bizony az app mappába fordítsa a dolgokat:

```
{
 "compilerOptions": {
   ...
 "outDir": "app",
   ... 
 }
}
```

Mivel az app mappába fordulnak a dolgaink, ezért a systemJS konfigjához nem kell nyúlnunk. A könyvtárszerkezetet kicsit vigyük tovább, legyen hasonló:

\- app  
\---- components (nevéből is jön, hogy az egyes komponenseket helyezzük ide )  
\---- modules (modulokat fogjuk ide szervezni)  
\---- domain (itt lesznek az üzleti domain elemei, pl. a modeljeink, amikkel dolgoznak a service-ek)  
\---- services (itt tároljuk majd a service-einket)

Mit is jelenít meg egy blog? Bejegyzéseket, tehát a komponens, amit létrehozunk legyen pl. `post-list.component.ts`:

```
import { Component } from '@angular/core';

@Component({
 selector: 'post-list',
 templateUrl: './templates/post-list.html'
})
export class PostListComponent {
}
```

Most nem egy beégetett templatet használunk, hanem külön template fájlokat, hogy elkülönítsük a HTML-t a JavaScript kódtól. Ezeket a templates mappában tároljuk majd. A komponensünk lesz felelős azért, hogy a rendelkezésére álló adatok segítségével feltöltse a template-et.

Ahhoz, hogy legyen mivel feltölteni, azonban adatok szükségesek, ami adatoknak jelen esetben biza típusa is lesz. Ez a típus legyen most a Post, amit az` app/domain/post.ts` fájlba helyezzünk:

```
export class Post {
 post_title : string;
 post_content : string;
}
```

Most, hogy ez megvan, importáljuk is be a komponensünk elején, valamint vegyük fel mint privát változót, kívülről nem akarjuk ugye piszkálni:

```
import { Post } from '../domain/post';

export class PostListComponent {
    private posts: Post[]; // ez egy Post-okból álló tömb lesz, ami jelenleg még üres
}
```

Emlékszünk hogy is csináltuk ezt még Angular 1 alatt? Bizony, a szervízbe injektáltunk egy http komponenst, ami szervízt pedig a kontrollerbe injektáltunk be. Itt nincs kontrollerünk, helyette van egy komponensünk. Na de nem visszafele haladunk, először kell a service, ami képes http segítségével lekérni a dolgokat, pl. `post.service.ts`:

```
import { Http } from '@angular/http'; // kikérjük a Http kliens a Http modulból
import { Injectable } from '@angular/core'; // az Injectable annotációra szükségünk lesz, hogy be tudjuk injektálni a service-ünket
import { Post } from '../domain/post'; // a Post-ra szükségünk lesz a típus miatt
import 'rxjs/add/operator/toPromise'; // az rxjs-re azért lesz szükségünk, hogy Promise-á tudjuk alakítani az Observable-t amit az angular visszaadna

@Injectable() // megjelöljük, hogy beinjektálható
export class PostService {

 private http: Http; // a Http kliens, amit használunk majd
 private apiUrl : string = "/posts.json"; // innen kérjük majd le a post-okat

 public constructor(http: Http) {
    this.http = http; // a Http is meg van jelölve, mint injektálható
 }

 public getPosts(): Promise<Post[]> { // egy Post tömbbel teli Promise-al térünk vissza
    return this.http.get(this.apiUrl).toPromise().
           then((response) => { // ha resolved, akkor
                return response.json().data as Post[]; // leparse-oljuk a válasz JSON-t, és annak a data fieldjét visszaadjuk, mint Post tömböt
           })
           .catch(this.onError); // ha gáz van, akkor logolunk egyet 

 }

 public onError(error : any) {
    console.log(error);
 }
}
```

Na a fenti most egy kicsit soknak tűnhet, ezért nézzük át mi is történik itt. Tehát létrehoztunk egy service-t, ami az angular Http kliensét használja. Ez a kliens ún. Injectable, ami azt jelenti, hogy amikor pl. komponenseket, stb. példányosít az angular és a konstruktorában fel van tüntetve mint típus, akkor az angular ezt helyettünk beinjektálja. Ez az Injectable annotáció az egyik feltétele, a másik pedig a providers tömb lesz, de erről majd a komponensünknél.

Mi is megjelöljük a saját service-ünket, mint Injectable, tehát amikor a komponensünk konstruktorában hivatkozunk rá, akkor példányosít egy http klienst, beinjektálja a service-be, majd a service-t átadva a komponensnek, már a célegyenesben is vagyunk.

Egyelőre egy metódusunk lesz, amivel az összes Postot szeretnénk lekérni. Ezt a `'posts.json' `elérési úton tesszük meg, mégpedig egy GET metódussal. Az angular Http kliense alapból egy Observable<Response>-al tér vissza, aminek fel tudunk iratkozni bizonyos életeseményeire, az observer pattern alapján, de mi Promise-t szeretnénk most inkább visszaadni. Ehhez szükségünk van a 3rd party rxJS toPromise wrapperéhez, amivel Promise-t csinálunk az iménti objektumból. Aztán ha sikeres a lekérés, akkor a kapott string-et JSON-é alakítjuk, lekérjük a data mezőt belőle és visszaadjuk mint egy Post tömböt, hogy a típusok klappoljanak. Ha nem sikerül, akkor logolunk egyet az onError metódusunkkal.

A következő lépés az lesz, hogy ezt a kapott értéket valahogy átadjuk a komponensünknek a` post-list.component.ts`-ben:

```
import { Component } from '@angular/core';
import {PostService} from '../services/post.service'; // a service-t behúzzuk
import {Post} from '../domain/post'; // behúzzuk a Post-unkat

@Component({
 selector: 'post-list',
 providers : [PostService], // meg kell jelölnünk, hogy a komponensünk számára injektálható elem a PostService lesz.
 templateUrl: './templates/post-list.html'
})
export class PostListComponent {

 private posts : Post[]; 
 private service : PostService; // felvesszük tagváltozónak

 public constructor(service : PostService) { // beinjektáljuk
    this.service = service; // értéket adunk neki
    this.service.getPosts().then((p) => { // majd rögtön a konstruktorban inicializáljuk értékekkel
      this.posts = p; // amit kapunk vissza, ugye a Post tömb, értékül rendeljük a tagváltozónknak.
    });
 }
}
```

A konstruktorban való munka nem szép, de majd találunk rá jobb módszert, hogy a komponensünk mihamarabb megjelenítse az adatokat.

Nézzük most a template-ünket! Nem fogunk egyelőre semmi fancy-t csinálni, csak működésre akarjuk bírni, ugye?

```
<div class="container">
 <div class="post-preview" *ngFor="let post of posts">
 <h3 class="post-title">{{post.post_title}}</h3>
 </div>
</div>
```

Egyelőre csak a címeket jelenítjük meg, hogy lássuk működik-e. Ha igen, azután preview-t fogunk vágni a kontentből és unescaped megjelenítjük. De ami itt a furcsaság, hát bizony, sehol egy ng-repeat. Ehelyett bekerült az \*ngFor, ami hasonlóképp működik, mint az ng-repeat tette az angular 1 alatt. Tehát nem **ng-repeat**="post **in** posts", hanem **\*ngFor**="**let** post **of** posts". Kiemeltem a változásokat, ezek mindegyike fontos, hogy jól működjön a dolog. Tehát itt most végigiterálunk a posts tömbjén a `PostListComponent` példányunknak és minden elemre kirenderelünk egyet a fenti `post-preview` div-ünkből.

Na akkor most jön még egy elem, ami változik az [előző cikk]({{ site.url }}/2016/10/10/angular-2-typescript-modra/) óta, az` app.module.ts`. Ne feledjük, már átkerült az `app/modules` mappába:

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PostListComponent } from '../components/post-list.component';
import {HttpModule} from '@angular/http';

@NgModule({
 imports:[ BrowserModule, HttpModule ],
 declarations : [ PostListComponent ],
 bootstrap : [PostListComponent]
})
export class AppModule { }
```

A változás annyi, hogy behúzzuk a szükséges HttpModule-t valamint importáljuk azt. Ezután a PostListComponentet jelöljük meg, mint bootstrap komponens és mint a deklarációkat tartalmazó elem.

Az `app/main.ts `annyiban változik, hogy máshol található a modulunk:

```
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './modules/app.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
```

Na már csak pár apró lépés!

Először is a `posts.json` tartalmát fel kellene töltenünk, nemde?

```
{
 "data": [
 {
 "post_title": "That is a title",
 "post_content": "<p>That's some text inside a paragraph</p>"
 },
 {
 "post_title": "Yet another title",
 "post_content": "<p>It works with <a href='#/link'>links</a> too</p>"
 }
 ]
}
```

Ezen felül még az `index.html`-be kell belenyúlni, hiszen már nem a `my-app` selectorra akasztjuk rá a komponensünket, hanem a `post-list`-re:

```
 <body>
 <post-list>Loading...</post-list>
 </body>
```

Ha ezt mindet elkövettük, akkor láthatjuk, hogy a main.ts betöltődik, behúzza a modulunkat, ami behúzza a komponenst, átadja neki a service-t, aminek előtte átadta a http klienst. Ezután a komponens a konstruktorában meghívja a service getAllPosts metódusát és a visszatért értékekkel populálja a templatünket. Valahogy így:

[![Selection_050](assets/uploads/2016/11/Selection_050.png)](assets/uploads/2016/11/Selection_050.png)

Hát ez még nem valami szép, de már sikerült adatot megjelenítenünk a backendről. A gond már csak az, hogy ez csúnya és nem csak a címek kellenének, hanem valami előnézet is, nemde?

Az első lépés az lesz, hogy lévén lusta vagyok és a <del>design érzékem is kimagasló</del>, behúzok egy bootstrap-et, pár custom css-t ráeresztek és bumm. A következő pedig az lesz, hogy felvesszük a post\_content-et is az elemek közé.

Akkor kezdjünk is neki:

```
npm install bootstrap
```

Ha ez megvolt, akkor az index.html tetejébe biggyesszük be:

```
<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
```

Ha ez megvolt, akkor nézzük a `post-list.html`-t:

```
<div class="container">
 <div class="post-preview" *ngFor="let post of posts">
 <h3 class="post-title">{{post.post_title}}</h3>
 <p class="post-excerpt">{{post.post_content}}</p> <!-- felvettünk egy plusz elemet a sorba, a kontent ide kerül majd -->
 </div>
</div>
```

Ezután, ha frissül az oldal, akkor a következő látvány fogad bennünket:

[![Selection_051](assets/uploads/2016/11/Selection_051.png)](assets/uploads/2016/11/Selection_051.png)

Ójaj, nagy a baj! Mivel a CMS-ek nem sima szöveget tárolnak el, hanem markupot, ezért amikor azt megjelenítjük, az Angular kérdés nélkül kiescapeli azt. Ez nekünk nem a megfelelő működés, ezért egy gonosz hackhez folyamodunk:

```
  <div class="post-excerpt" [innerHTML]="post.post_content"></div>
```

A kapcsos zárójelek közötti elemekkel az adott elem attribútumára tudunk ráhatni, így itt a paragraph innerHTML-jét tudjuk beállítani. Az eredmény magáért beszél:

> [![Selection_052](assets/uploads/2016/11/Selection_052.png)](assets/uploads/2016/11/Selection_052.png)Persze ne feledjük, hogy az ilyenekkel nagyon vigyázni kell, mert biztonsági kockázatot jelenthet bármit anélkül megjeleníteni, hogy ránéznénk az illető körmére. Jelen esetben fix helyről, csak tőlünk jön az adat, ennélfogva itt alkalmazható, de ne szokjunk hozzá. A kommentek esetében már semmiképp nem fogunk ilyenhez folyamodni.

A következő problémánk az az, hogy is tudjuk lerövidíteni a megjelenített szöveget? Szükségünk lenne egy kis előnézetre a kontentből. Ha valamelyik post\_content-et kibővítjük száz sorra, akkor az elég csúnyán fest, nemde?

WordPress adatbázisra fogunk Apigility segítségével egy REST API-t ültetni, de az még odébb van, így a cikkben statikus adatokat szolgálunk ki, json fájlokból, viszont az itteni "szokásokat" fogjuk követni.

A WordPress egy `\<!--more--> `tag-et helyez el és e mentén tudjuk darabolni az előnézet és annak további részét. Tehát kell csinálnunk valamiféle filtert, ami e mentén elhasítja a dolgot. Pontosabban ehhez nem filterre, hanem ún. Pipe-ra lesz szükségünk, hiszen már Angular 2-ről van szó. Hozzunk létre tehát egy `app/pipes/preview.ts`-t:

```
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'preview'
})
export class PreviewPipe implements PipeTransform {

  private MORE_TAG : string = "<!--more-->";

  transform(value: string) : string {
    let position = value.indexOf(this.MORE_TAG);
    return value.substring(0, (position == -1) ? value.length : position );
  }
}
```

Először is behúzzuk a `Pipe` annotációt, amivel megjelöljük, hogy ez biza egy Pipe lesz, valamint nevet is kap, amivel majd a templateben hivatkozunk rá. A másik fontos dolog, hogy implementálja a` PipeTransformot`, aminek a transform metódusa lesz amit meg kell valósítani. Ez a transform megkapja a stringet, amit feldolgozunk, valamint az esetleges paramétereket, amiket a filterünknél megadunk és visszaadja a feldolgozott stringet, pretty simple. Megkeressük a szövegben az imént említett more\_tag-et és amentén elvágjuk azt. Ha pedig nincs benne, akkor az egész stringet visszaadjuk.

Ahhoz, hogy ez működjön, a modulban fel kell vegyük, mint declarations eleme:

```
import {HttpModule} from '@angular/http';
import {PreviewPipe} from '../pipes/preview';


@NgModule({
  imports:[ BrowserModule, HttpModule ],
  declarations : [ PostListComponent, PreviewPipe ],
  bootstrap : [PostListComponent]
})
export class AppModule { }
```

A templateben is kell némi módosítást megejtenünk:

```
    <div class="post-excerpt" [innerHTML]="post.post_content | preview"></div>
```

A szintax hasonló, mint angular 1-ben volt, a '|' után jön az adott pipe neve és mindez működik a \[\] szintaxissal is. A `posts.json` tartalmát szerkesszük az alábbiak szerint:

```
{
    "data": [
        {
            "post_title": "That is a title",
            "post_content": "<p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><!--more--><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p><p>That's some text inside a paragraph</p>"
        },
        {
            "post_title": "Yet another title",
            "post_content": "<p>It works with <a href='#/link'>links</a> too</p>"
        }
    ]
}
```

Láthatjuk, hogy bődületesen hosszúnak kellene lennie, de a pipe miatt nem lesz olyan vészes a dolog:

[![Selection_053](assets/uploads/2016/11/Selection_053.png)](assets/uploads/2016/11/Selection_053.png)

Most ennyire futotta, a következő részben nekiesünk a routingnak, hiszen szeretnénk navigálni az egyes nézetek között, pl. belenavigálni egy teljes blogbejegyzésbe. Ráengedünk egy egyszerű menüt, meg némi CSS-t, hogy valahogy mutasson is az oldal, utána pedig következik az Apigility backendje és a kommentek.

</body>
