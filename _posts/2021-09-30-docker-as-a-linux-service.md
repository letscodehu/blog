---
id: 6242
title: 'Docker as a (Linux) Service?'
date: '2021-09-30T09:42:44+02:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=6242'
permalink: /2021/09/30/docker-as-a-linux-service/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2021/03/pexels-andrey-grushnikov-707676.jpg'
categories:
    - Advanced
    - DevOps
tags:
    - daemon
    - docker
    - systemd
---

Konténereket elindítani könnyű, akár egy jól szituált shell script, akár docker-compose segítségével is, de egyes esetekben érdemes az adott hosztgép init system/process menedzserét használni. Mivel a legtöbb nagyobb linux disztribúció (igen, ez megint egy linuxos poszt lesz, **sajnálom**) a systemd irányba megy, ezért mi is egy ilyen példán át fogjuk megvizsgálni.

Na de mikor jöhet ez jól? Meg miért nem kubernetes, vagy valami hasonlót használunk, hiszen már egy shell script és a rancher féle k3s fut a gépünkön. Ez a megoldás ott lesz különösen hasznos, amikor a gépen futó szolgáltatások egymásra dependálnak és ezeknek egy részét, **de nem az egészét** konténerizálni akarjuk, vagy eddig is konténerben futottak. Ezt a fajta szekvenciális indítási módot nemigen tudjuk elérni, főleg ha csak egy` --restart unless-stopped` kerül a `docker run` parancshoz. Az újraindítási próbálkozások számát, időközeit is testre tudjuk szabni így, amire sajnos a docker nem alkalmas. Sőt, a saját dokumentációjukban is process menedzsert ajánlanak a speciális esetekre.

De miért is ne konténerizálnánk valamit? Mind a mai napig akadnak olyan - főleg legacy, vagy grafikus kártyát használó - alkalmazások, amik konténerizálása problémás, mert nincsenek erre felkészítve. Ha ezekből akarunk elemeket konténerbe kiemelni, esetleg a már meglévő függőségeiket konténerbe csomagolni - egyazon hosztgépen, akkor nemigen van könnyebb út.

De lássunk is neki! A példa kedvéért egy nagyon egyszerű konténerizált redis fog systemd segítségével futni, amit aztán kiegészítünk, hogy egy másik - nem konténerben futó - szolgáltatás is függjön tőle. Ha ez a másik is konténerben futna, akkor egy sima `docker-compose` is elég lenne. Ubuntu 20.04 alatt csinálom mindezt, de nemigen lesz különbség a többi distroban se.

Hozzunk létre egy service fájlt, pl `/etc/systemd/system/docker.redis.service`:

```
[Unit]
Description=Redis Container
After=docker.service
Requires=docker.service

[Service]
TimeoutStartSec=0
Restart=always
ExecStartPre=-/usr/bin/docker stop %n
ExecStartPre=-/usr/bin/docker rm %n
ExecStartPre=/usr/bin/docker pull redis
ExecStart=/usr/bin/docker run --rm --name %n redis

[Install]
WantedBy=multi-user.target
```

Ha ezzel megvagyunk, akkor már csak el kell indítanunk ezt:

```
sudo systemctl start docker.redis
```

Utána pedig ha lekérdezzük az állapotát:

```
sudo systemctl status docker.redis
```

És bizony azt látjuk, hogy aktív, fut, habár még `disabled`. Ettől nem kell megijedni, annyit jelent, hogy nem indul el automatikusan. Ezt majd később fogjuk bekapcsolni, mert még sokat fogunk túrkálni benne.

```
● docker.redis.service - Redis containerized Service
     Loaded: loaded (/etc/systemd/system/docker.redis.service; disabled; vendor preset: enabled)
     Active: active (running) since Mon 2021-09-27 22:15:39 CEST; 18s ago
    Process: 246875 ExecStartPre=/usr/bin/docker stop docker.redis.service (code=exited, status=1/FAILURE)
    Process: 246897 ExecStartPre=/usr/bin/docker rm docker.redis.service (code=exited, status=1/FAILURE)
    Process: 246907 ExecStartPre=/usr/bin/docker pull redis (code=exited, status=0/SUCCESS)
   Main PID: 247019 (docker)
      Tasks: 10 (limit: 19094)
     Memory: 82.5M
     CGroup: /system.slice/docker.redis.service
             └─247019 /usr/bin/docker run --rm --name docker.redis.service redis

szept 27 22:15:39 rucsok-core docker[246907]: Status: Downloaded newer image for redis:latest
szept 27 22:15:39 rucsok-core docker[246907]: docker.io/library/redis:latest
szept 27 22:15:39 rucsok-core systemd[1]: Started Redis containerized Service.
szept 27 22:15:40 rucsok-core docker[247019]: 1:C 27 Sep 2021 20:15:40.173 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
szept 27 22:15:40 rucsok-core docker[247019]: 1:C 27 Sep 2021 20:15:40.173 # Redis version=6.2.5, bits=64, commit=00000000, modified=0, pid=1, just started
szept 27 22:15:40 rucsok-core docker[247019]: 1:C 27 Sep 2021 20:15:40.173 # Warning: no config file specified, using the default config. In order to specify a config file >
szept 27 22:15:40 rucsok-core docker[247019]: 1:M 27 Sep 2021 20:15:40.174 * monotonic clock: POSIX clock_gettime
szept 27 22:15:40 rucsok-core docker[247019]: 1:M 27 Sep 2021 20:15:40.174 * Running mode=standalone, port=6379.
szept 27 22:15:40 rucsok-core docker[247019]: 1:M 27 Sep 2021 20:15:40.174 # Server initialized
szept 27 22:15:40 rucsok-core docker[247019]: 1:M 27 Sep 2021 20:15:40.174 * Ready to accept connections
```

Akkor most nézzük meg azt a bizonyos service fájlt, hogy mi is történik, mert lehet nem egészen tiszta, és később lehet még annyira se lesz az, mert fogunk benne túrkálni.  
Először is látjuk, hogy a redisünk függ a` docker.service`-től. Érthető, anélkül sok értelme nem lenne.  
A `TimeoutStartSec=0` kikapcsolja a várakozási limitet, hiszen az adott képfájl méretétől függően sokáig tarthat annak letöltése.  
Mielőtt elindítanánk, előtte leállítjuk, majd töröljük, ha már létezik ez a konténer, utána pedig letöltjük a legfrissebb redis-t. Itt persze megadhatunk verziót is, lévén ha már systemd-t használunk, stabilitásra törekszünk.  
A '-' a parancsok elején azért kellenek, mert a systemd nem fogja félbehagyni az indítást, ha esetleg a parancs nem 0 kóddal zárul. Ez a helyzet az első indításkor is, hiszen még nem létezik ez a konténer.  
Mivel minden indításkor teljesen nulláról indítjuk a konténert, ezért érdemes volume-okkal operálni, hogy az adatok megmaradjanak, valamint ha nem egy másik konténer használja a szolgáltatást, akkor a portot is ki kell vezessük valahol.

> Mivel nem adtunk meg `RestartSec` értéket, ezért várakozás nélkül újra és újra indítja a konténert, ha esetleg valamiért leállna indulás után, és mivel az újraindítások számát se limitáltuk, ezért a végtelenségig csinálja. Természetesen ezt is meg tudjuk oldani és fontos is megoldani, ugyanis a dockerhubon igen hamar elérjük a pull rate limitet, ha tizedmásodpercenként próbáljuk újra lehúzni a képfájlokat, utána pedig bajban leszünk, mivel a docker pull elszáll, ezért a service indítása is elszáll, ami megint egy docker pullt fog jelenteni és így tovább... Erre persze megoldás lehet a saját privát docker repository, de azt se akarjuk DoSolni, ezért érdemes az a RestartSec is, ami másodpercben adja meg mennyit várjon két indítási kísérlet közt.

Csináljunk egy másik service-t, ami a redisünktől függ, legyen a `/etc/systemd/system/app.service `!

```
[Unit]
Description=App Service
After=docker.service
Requires=docker.service
After=docker.redis.service
Requires=docker.redis.service

[Service]
TimeoutStartSec=0
Restart=always
RestartSec=5
ExecStart=/usr/bin/sleep 1000000

[Install]
WantedBy=multi-user.target
```

A fenti service már nem csak a docker.service-től függ, hanem a redistől is, amit csináltunk. Nem sok mindent csinál, mint vár, de nekünk ez pont elég most.  
Indítsuk el:

```
sudo systemctl start app.service
```

A leállításról is ejtsünk pár szót, mármint a dockerrel futtatott szolgáltatásoknál. Itt fontos lehet a dockerben futó init használata, ugyanis enélkül a futó folyamattól függően fog reagálni azokra a signalokra, amiket a systemd a docker kliensen át küld és lehet sosem állna le.  
A másik módszer erre, ha a service leíróban megadunk egy timeoutot a leállításra. Itt először `SIGTERM`, majd a timeout elérése után `SIGKILL` segítségével állítjuk le a folyamatot. Ez utóbbival az a gond, hogy ezt a folyamatok már nem tudják belül kezelni, ezért ha valami írás, stb közben történik mindez, akkor bizony az félbemarad. Ha 10 másodpercet akarunk hagyni, hogy leálljon rendesen a szolgáltatás, akkor az alábbi rész kell a `[Service]` szekcióba:

```
TimeoutStopSec=10
```

Ahhoz, hogy automatikusan induljanak a szolgáltatásaink, engedélyezni kell őket:

```
sudo systemctl enable docker.redis.service
sudo systemctl enable app.service
```

Így a rendszer indulásakor a dockert követően ezek is elindulnak majd automatikusan.

Akkor minden pöpecül megy, nemde? A gond itt továbbra is az, hogy a systemd nem magát a konténerben futó folyamatot, hanem a docker klienst monitorozza. Tehát ha valamilyen okból a kliens lecsatlakozik a konténerről, akkor kíméletlenül leállítja és újraindítja azt, holott a konténerben levő folyamat él és virul. Ez persze nem gyakori eset, de attól még kellemetlen, ha bombabiztos serviceket akarunk csinálni. Létezik erre is egy [systemd-docker](https://github.com/ibuildthecloud/systemd-docker "systemd-docker") nevű megoldás, viszont ez már tényleg csak a hardcore embereknek ajánlom, na meg a go fanoknak 🙂

Viszont az eredeti célunkat elértük, sikerült linux servicet varázsolni konténerekből, ami egy kicsit kifordítottja annak, amire használni szokták mindezt, de ahogy a bevezetőben is írtam, akadnak esetek, amikor ez a legjobb megoldás.

Akinek újabb distroja van, pl Ubuntu 20.10, Debian 11, azoknak csomagkezelőből elérhető a `podman` is, amivel futó konténerekből lehet service leírót generálni, erről több infót [itt](https://docs.podman.io/en/latest/markdown/podman-generate-systemd.1.html "itt") találtok.

Akit jobban érdekel a systemd és hogy mit is lehet bekonfigurálni rajta, az [itt](https://www.freedesktop.org/software/systemd/man/systemd.service.html "itt") talál bővebb leírást.