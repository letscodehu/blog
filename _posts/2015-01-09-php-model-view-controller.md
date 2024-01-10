---
id: 95
title: 'PHP Model-View-Controller'
date: '2015-01-09T10:38:08+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=95'
permalink: /2015/01/09/php-model-view-controller/
dsq_thread_id:
    - '3404372520'
    - '3404372520'
categories:
    - Intermediate
    - MVC
    - PHP
tags:
    - class
    - controller
    - model
    - mvc
    - php
    - view
---

Annyira divatos kifejezés az MVC manapság, ellenben amikor valaki megpróbálja elmagyarázni, akkor eszembe jut, hogy ezt talán lehetne másképp is értelmezni. Az MVC a címben is szereplő hármast, a model-view-controller triumvirátusát jelenti, amiből a kliens minden esetben egy-egy view-al találkozik.

A lényege ennek, hogy a kódunkat feldaraboljuk három nagyobb különálló részre, melyek egymással állnak kapcsolatban.

A controller feladatát roppant egyszerűen tudnánk leírni, a kliens kéréseit lefordítja a model nyelvére és amit a model visszaad, azt pedig beletölti a hozzá tartozó view-ba.

A model esetünkben a business logic, vagyis minden ami az adatainkkal kapcsolatos. Ezek különálló részek, több osztályt kell elképzelni, melyek a modelen belül egymással interakcióban állnak.

A view általában template-kből (és a hozzájuk tartozó helperekből áll). Ez is több osztályt jelent, amik szintén egymással állnak kapcsolatban, de a feladatuk viszonylag egyszerű. Ők produkálják a kimenetet. Tehát sem a controllerben, sem a modelben nem szabad egyetlen echo vagy épp print (és társai) -t elhelyezni. Az nem az ő feladatuk.

De vegyünk egy átlagos workflow-t. Mint mondtam, mi minden esetben egy view-al találkozunk, ami egy adott "action"-höz tartozik.

> Na és amikor a www.facebook.com-ot hívom meg, akkor is van view, akkor mi az az action okoska?

(A facebook más elvek alapján építi fel a rendszerét, amit fluxnak hívnak, de ez jó példa lehet).

Az ebben az esetben az indexAction (hogy Zendüljünk kicsit). Tehát a kliens (bármi csak ne IE) elküldi a kérést a webszervernek. A controller látja, hogy nem adtunk át paramétert, se semmit (na jó, legyen valami session cookie, hogy mégse a login oldalt lássuk), tehát az index oldalt akarjuk látni (legalábbis szerinte, azért a routing általában ennél bonyolultabb) és meghívja a modelt, azzal, hogy "add hát ide a hírfolyam elemeit, meg úgy az alap user related (oldalak, friendlist, stb) dolgokat".

```
<?php

class frontController {
// ez az osztály ami értelmezi magát a lekérdezést, URI paraméterek, sütik, hasonlók alapján és meghívja a szükséges controller szükséges metódusát, ezáltal routing feladatot végez
}
/***************************** külön fájl *****************************/
class facebookController {
// a facebook alkalmazásunk (mintha lenne több is :D) kontrollere és az index oldalhoz tartozó metódus
          public function indexAction($id) {

          $user =  $this->userMapper->getUserById($id); // az adott mapperek idekerülhetnek a konstruktorból, dependency injectionnel, öröklődéssel, service locator, stb. ez nem ennek a leckének a része        
          $news =  $this->postMapper->getPostsByUid($uid); // rémesen leegyszerüsítve
// meghívjuk az indexview-t és átadjuk neki a változókat
          $view = new IndexView(['news' => $news, 'user' => $user ]); 
          $view->display(); // jelenítsük meg
          }
}
/ ***************************  külön fájl ***************************/
class IndexView {
          public function __construct($params) {
               foreach ($params as $key => $value) { // végigjárjuk a kapott tömböt és hozzáadjuk a példányváltozóinkhoz a kapott néven
                   $this->$key = $value // a $key ez esetben egy variable variable, vagyis ha $key == 'user', akkor később $this->user-ként tudunk rá hivatkozni  
               }
          }
          public function display() {
          // itt include-olhatjuk a template fájljainkat, mivel a scope az adott objektum, ezért a $this->user-t és a $this->news-t lehet használni benne

          }
 }
```

Ezt azért kevésbé string módjára végzi, hanem pl. meghívja a usermapper nevű osztály getUserById metódusát és átadja neki az ID-t. (Előtte akár lefordíthatja a kapott session ID-t, vagy bármi alapján kereshet). A usermapper belenyalja magát az adatbázisba (vagy cache-be, de ne bonyolítsuk), megtalálja az adott sort v. sorokat, aztán egy hydrator segítségével a sor egyes mezőit beletölti egy User objektumba ( $u->setUid($resultset\['uid'\]), vagy akárhogy, csak egy szimpla példa volt) és ezt az objektumot visszaadja a controllernek.

A controller ezután meghívj egy másik modelt, ami az üzenőfalért felelős és lekérik az adott felhasználóhoz tartozó bejegyzéseket és azokat is objektumként (vagy épp azok tömbjeként) visszaadja. Ezt eljátszhatja a friendlisttel, bármivel. Az, hogy mire van szükségünk az adott controller (igen, akár több is lehet, de megint bonyolítjuk... ) adott metódusában lesz benne. Ez a metódus lesz felelős az alkalmazásunk index oldalának irányításáért.

Tehát ha megvannak a szükséges információk, akkor itt az ideje megjeleníteni. Van egy nagyon szép kis template-ünk, ami legyen .phtml (php és html) fájl. Sőt, lehet több is, hiszen az oldalainkon a header és footer gyakorta állandó.

```
// header.phtml
<html>
<head><title>Index</title></head> // ide is beszúrhatunk mindenfélét, headscript-et, a címet, css-t, csupán ezeket is át kell adnunk a view-nak (és például helperek segíthetnek az odavezető URL-t összerakni, stb.)
```

```
// indexcontent.phtml
<body>
<?php foreach ($this->news as $post): ?> // mivel az osztályon belül include-oltuk, ezért hozzáférünk a $this scope-hoz
// és itt már csak a saját fantáziánkon múlik, hogy a kapott objektumot hogy érjük el és hogy rendezzük a kinézetét.
<?php endforeach; ?>
```

```
// footer.phtml
// ide pedig kerülhetnek a body script-ek, vagy bármi, amit szeretnénk.
</body></html>
```

Remélem a leírás használható volt, bármi kérdés van, netán hibák/hiányosságok, tessenek szólni, vagy kézzel inteni.

</body></html>
