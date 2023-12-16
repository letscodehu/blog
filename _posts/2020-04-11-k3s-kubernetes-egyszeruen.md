---
id: 2224
title: 'k3s &#8211; Kubernetes egyszerűen?'
date: '2020-04-11T15:11:18+02:00'
author: janoszen
layout: post
guid: '/?p=2224'
permalink: /2020/04/11/k3s-kubernetes-egyszeruen/
newsphere-meta-content-alignment:
    - align-content-left
amazonS3_cache:
    - 'a:4:{s:56:"//www.letscode.huassets/uploads/2020/04/image-5.png";a:2:{s:2:"id";i:2225;s:11:"source_type";s:13:"media-library";}s:65:"//www.letscode.huassets/uploads/2020/04/image-5-1024x557.png";a:2:{s:2:"id";i:2225;s:11:"source_type";s:13:"media-library";}s:79:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/04/11110812/image-5.png";a:2:{s:2:"id";i:2225;s:11:"source_type";s:13:"media-library";}s:88:"//d1nggucqgkhstg.cloudfront.netassets/uploads/2020/04/11110812/image-5-1024x557.png";a:2:{s:2:"id";i:2225;s:11:"source_type";s:13:"media-library";}}'
image: 'assets/uploads/2020/04/11115305/k3s.png'
categories:
    - DevOps
tags:
    - cloud
    - k3s
    - kubernetes
---

Aki [követi a munkásságomat](https://pasztor.at) tudja, hogy noha aláírom, hogy a Kubernetes tud hasznos lenni, óvatos optimizmussal közelítem meg a kérdést. Azt gondolom, hogy a nagy játékosok kivételével (telekommunkációs cégek, Silicon valley óriások, nagy áruházláncok) a Kubernetes használata sokszor gyakorlati problémákba ütközik, különösen a KKV szektorban.

Természetesen hivatkozhatunk arra, hogy a nagy háromtól (AWS, Google Cloud, Azure) kapunk Kubernetes szolgáltatást úgy, hogy nem kell vele foglalkozni, de ez így ilyen formában nem egészen igaz, hiszen egyrészt fizetnünk kell érte (és a Google pl. most emelt árat) másrészt könnyen lehet, hogy különböző jogi vagy politikai okokból az amerikai felhőszolgáltatók igénybevétele akadályokba ütközik. Így például a mai napig vita folyik arról, hogy a európai GDPR és az amerikai CLOUD Act ütközik-e egymással vagy sem.

Ugyanakkor a saját Kubernetes üzemszerű futtatása minden, csak nem egyszerű. A telepítést még csak-csak megoldják mindenféle eszközök helyettünk (például kubeadm, kubespray, stb), de a problémák megoldása már ránk hárul és nem kevés hozzáértést igényel.

Ez egész egyszerűen a Kubernetes jellegéből és alapötletéből adódik: ne úgy gondoljunk rá mint egy kész termékre, inkább úgy, mint egy csináld magad összeszerelőkészletre. Ezer és egyféle képpen összedughatjuk, és ha nem működik, akkor csak magunkra vethetünk. Ráadásul ha megnézzük a [Cloud Native Foundation Landscape térképét](https://landscape.cncf.io/) elkezd jojózni a szemünk, hogy hány féle megoldásból választhatunk.

<figure class="wp-block-image size-large">![](assets/uploads/2020/04/11110812/image-5-1024x557.png)<figcaption>*A CNCF Landscape a cikk írásakor*</figcaption></figure>Itt jönnek be azok a megoldások amik nem egy legókészletet adnak a kezünkbe, hanem egy konkrét, jól összeépített megoldást biztosítanak. Természetesen itt a testreszabhatóság látja kárát, hiszen egy „opinionated” megoldást kapunk, azaz valaki elképzelését arról, hogy mi a jó.

## k3s

Az egyik ilyen megoldás a [Rancher](https://rancher.com/) háza tájáról érkezik és k3s névre hallgat. A Rancher már régóta biztosít egy jóval vastagabb, erőforrásigényesebb [megoldást ](https://rancher.com/products/rancher/)a Kubernetes futtatására és napi szintű menedzselésére, ám ez 4-5 gép magasságától indul és sok cégnek ez egyfajta infrastrukturális vízfejet jelent, amit nem szándékoznak kifizetni.

Nemrégen azonban kijöttek egy jóval izgalmasabb megoldással, a [k3s](https://k3s.io/)-sel. Azért k3s, mert a k8s a Kubernetes rendes rövidítése és a 8-ast itt félbe vágták, jelezve, hogy ez fele annyit tud és fele annyi erőforrást eszik.

Mit is csináltak a Rancheres fejlesztők itt? Egyrészt fogták a Kubernetes futtatásához szükséges fél tucat szolgáltatást (controller-manager, apiserver, scheduler, stb.) és összecsomagolták egyetlen futtatható programba, másrészt kidobták a rendes megoldáshoz kapcsolt viszonylag erőforrásigényes etcd adatbázis szervert és betettek a helyére egy sqlite-ot. Ez természetesen a redundancia kárára megy, hiszen az sqlite nem tud adatot szinkron módon replikálni. De ez nem is baj, hiszen a k3s olyan 1-2 szerveres, vagy akár Raspberry Pi setupokhoz van kitalálva, ahol a vezérlést biztosító API rövid idejű kiesése nem okoz helyrehozhatatlan károkat.

Ami még izgalmas, hogy a normális, x509-es tanusítvány-alapú clusterezést kicserélték egy jóval egyszerűbb, token alapú mechanizmusra. Ezzel jelentősen leegyszerűsítették a szerverek összekapcsolását, ami egy szabvány Kubernetesnél mindig gondolkodást igényelt.

## A gyakorlat

Nézzük tehát, hogyan is tudunk k3s-t használni a gyakorlatban. Először is szükségünk lesz egy kurrens LTS Ubuntu telepítésre. Természetesen Debian Busteren vagy Alpine Linuxon is el tudjuk indítani, de itt további lépésekre lesz szükség.

A telepítés pedig nem több mint egy egyszerű shell script amit a [get.k3s.io](https://get.k3s.io) címen találunk. A hivatalos doksi a következő parancssort javasolja:

```
<pre class="wp-block-code">```
curl -sfL https://get.k3s.io | sh -
```
```

Ezen a ponton nem szeretnénk itéletet mondani a webről letöltött scriptekről, ezt már rábízzuk a mindenkori üzemeltető filozófiájára. A mindenkori [rendszerkövetelményeket pedig itt találja](https://rancher.com/docs/k3s/latest/en/installation/installation-requirements/) a kedves olvasó.

Miután a telepítő scriptet lefuttattuk, hozzávetőlegesen 30 másodperc múlva a `kubectl get node` parancs vissza fogja adni, hogy van egy kubernetes clusterünk és ebben egy node található. Ezen felül a processlistában ezt fogjuk látni:

```
<pre class="wp-block-code">```
/usr/local/bin/k3s server
 \_ containerd -c /var/lib/rancher/k3s/agent/...
/var/lib/rancher/k3s/data/ca752b211ccbacb1b66...
 \_ /pause
 \_ /coredns -conf /etc/coredns/Corefile
/var/lib/rancher/k3s/data/ca752b211ccbacb1b66...
 \_ /pause
 \_ /metrics-server
/var/lib/rancher/k3s/data/ca752b211ccbacb1b66...
 \_ /pause
 \_ /traefik --configfile=/config/traefik.toml
/var/lib/rancher/k3s/data/ca752b211ccbacb1b66...
 \_ /pause
 \_ local-path-provisioner start --config /etc/config/config.json
/var/lib/rancher/k3s/data/ca752b211ccbacb1b66...
 \_ /pause
 \_ /bin/sh /usr/bin/entry
 \_ /bin/sh /usr/bin/entry
```
```

Tehát szépen elindult a k3s és telepített is az alapvető szolgáltatásokat, a kubectl parancs segítségével pedig máris deployolhatjuk az alkalmazásainkat.

Ha ezen felül kedvünk szottyan clusterezni, olvassuk ki a tokent a `/var/lib/rancher/k3s/server/token` fájlból, majd a másodlagos gépen vagy gépeken hajtsuk végre a következő parancsot:

```
<pre class="wp-block-code">```
curl -sfL https://get.k3s.io | K3S_URL=https://ELSODLEGES-SZERVER-IPJE-IDE:6443 K3S_TOKEN=NODE-TOKEN-IDEsh - 
```
```

Ezzel az egyszerű művelettel máris van egy 2-3-4 node-os clusterünk.

## Árnyoldalak

A Kubernetes hatalmas előnye nem csak abból származik, hogy tologathatjuk a containereket ide-oda, hanem abból is, hogy beszél a felhőszolgáltatókkal. Így például lehetőségünk van egy adatbázis szerver alatti tárhely (block storage vagy megosztott fájlrendszer) felcsatolására azon a gépen ahol az adatbázis szerver éppen fut.

A Kubernetes azonban nem varázslat és önmaga nem biztosít ilyen tárolási megoldást. Ha nem felhőben futunk és nincs helyi storage, akkor alapértelmezetten csak a gazdagépeken tudunk tárolni adatokat, ezzel a containerünket az adott géphez kötve.

Ez egy kisebb telepítésben még rendben van, de ha kiesésmentes karbantartásokat szeretnénk, akkor bizony-bizony a rendszer korlátaihoz érünk. Ez nem a k3s hibája, egyszerűen a Kubernetes arra épít, hogy egy olyan felhőben futunk, ahol lehetőségünk van a storage felcsatolására.

Szintén kérdéses, hogy a relatíve friss k3s projekt mennyi ideig fog támogatást kapni. Tovább fejlesztik-e, követik-e a Kubernetes őrületes tempóját a 3 havi kiadásokkal, 9 hónapos támogatási ciklusokkal, vagy a projekt hátszél hiányában el fog halni.

## Nem kell túltolni

Kelsey Hightower, a Kubernetes és a cloud native egyik ismert szószólója [vetette fel Twitteren nemrég](https://twitter.com/kelseyhightower/status/1245886920443363329), hogy nem toljuk-e túl egy picit ezt a kérdést. Nincs minden alkalmazásnak szüksége ultraelosztott, soha le nem álló redundanciára és dinamikus skálázásra. A személyes tapasztalatom ezen a téren az, hogy a kis- és középméretű projekteknek kisebb gondja is nagyobb mint hogy skálázzon.

Természetesen új és izgalmas az a világ, ahol betoljuk a kódot a gitbe, az automatikusan kiszáguld a felhőbe, automatikusan skálázódik fel-le, és a fejlesztő mindent megkap amire valaha is vágyott anélkül, hogy kellene ezzel foglalkozni, de lássuk be: ennek ára van.

Egy ilyen infrastruktúra iszonyatosan komplex és nem egy olyan Kubernetes debug projektben vettem részt, ahol a felkent Kubernetes szakértők és fejlesztők nem tudták megmondani, hogy mi a baj, majd a végén kiderült, hogy egy banális Linux hibáról van szó.

Azt gondolom, hogy a k3s és a testvérei (microk8s, stb) rengeteg projektnek pont megfelelőek, és némi kézi energiabefektetéssel egy Kubernetes clusterhez jutunk ahol el tudjuk kezdeni deployolni a cuccokat úgy, ahogy a nagyok, és ha tényleg feltaláltuk a következő Facebookot, könnyű lesz migrálni egy teljes méretű, hiperszuper clusterre.