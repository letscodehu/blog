---
id: 97
title: 'Szabjuk át a szerverünket &#8211; 1. rész'
date: '2015-01-18T18:53:13+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=97'
permalink: /2015/01/18/szabjuk-szerverunket-1-resz/
dsq_thread_id:
    - '3432392169'
    - '3432392169'
categories:
    - Backend
    - Security
tags:
    - alias
    - linux
    - security
    - ssh
    - szerver
---

Ha az ember webfejlesztéssel foglalkozik, óhatatlan, hogy előbb-utóbb elcsábuljon, netán rendszergizda híján rákényszerüljön, hogy a szerverüzemeltetésbe belekóstoljon.

Itt most csak és kizárólag Linux alapú szerverekről fogok beszélni, ezért aki IS infókban reménykedett, azt el kell szomorítsam.

Többféle distribution akad, de jómagam a Debian mellett tettem le a voksom, mert ezt találtam (és sokan mások is) a legstabilabbnak, így azon fogom bemutatni a dolgokat.

#### Mit értünk testreszabás alatt?

A szerverünket, akár fizikailag ott van mellettünk, akár sem, közvetlenül sosem, csak közvetve érjük el SSH protokollon keresztül. Ennek bemutatását nem részletezném, hiszen ha valaki már rávette magát, hogy szervert üzemeltessen, annak ez nem újdonság. Minden amit alább tárgyalunk ennek a terminálnak a kezesebbé/biztonságosabbá tételére irányul.[![sudo](assets/uploads/2015/01/sudo.png)](assets/uploads/2015/01/sudo.png)

Az SSH protokoll default portja a 22-es és a root logint is engedélyezi alapesetben. Ezzel nem is lenne baj, ha nem tudnák ezt a "jószándékú" emberek is, akik random módon pásztázzák a különböző IP-címeket és amint találnak valakit, akinél az a bizonyos 22-es port nyitva, ott próbálkozni is fognak. Ennek a próbálkozásnak a kiküszöbölésére van egy `fail2ban` nevű program, ami x számú sikertelen próbálkozás után 5 percre pihenőpályára rakja az adott IP-címről érkező bejelentkezéseket. Azonban ez csupán lelassítja egy jól szituált brute-force esélyét, így más megoldásokat sem árt bevetnünk.

#### Turkáljunk hát kicsit az `/etc/ssh/sshd_config`-ban!

Az első dolog, amit át kell állítanunk, az a port, amit figyel a daemon. Ezt állítsuk át valami másikra, ami nem foglalt. Ajánlott ezért valami magas (10000+) portot megadni a későbbi ütközések elkerülése végett. Ezzel ki tudjuk szűrni, hogy minden jött ment próbálkozzon nálunk.

A másik fontos dolog, a root login kikapcsolása (persze előtte készítsünk egy usert magunknak, amit használni fogunk és adjuk hozzá a `/etc/sudoers` fájlban), ugyanis ha valaki megtalálta a gépünket SSH-n, akkor rögtön root-ként szeretne hozzáférni. Ha mégsem, a támadónak nem csupán a jelszót, de a jelszóhoz tartozó felhasználónevet is tudnia kellene, ami kettős brute-force megállapítása (ha normális jelszót választottunk) lehetetlen.

#### <del>Also known as</del> Alias

Amikor már századjára írunk be egy hosszú parancsot, akkor felmerülhet bennünk, hogy nincs minderre valami egyszerűbb mód?

Hát persze, hogy van!

Az `alias` parancsot futtathatjuk bash-ből, szintaxisa pedig roppant egyszerű:

```
alias rövidítés "/program/amit/futtatni/akarunk és a paraméterei"
```

Ebben az esetben az alias rögtön érvényes lesz, ellenben csak az aktuális login session időtartamáig tart. Ellenben elhelyezhetjük a saját home könyvtárunkban levő `.bashrc` fájlban (ha rendszerszintű alias-t akarunk bevezetni, akkor a `/etc/bashrc` fájlban) és a `newaliases `parancssal érvénybe léptethetjük a változásokat. Ez utóbbi módosítások permanensek és csak egy újabb törlés és `newaliases `paranccsal vagy restarttal törölhetőek.