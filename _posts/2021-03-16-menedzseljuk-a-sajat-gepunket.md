---
id: 5620
title: 'Menedzseljük a saját gépünket!'
date: '2021-03-16T23:17:56+01:00'
author: tacsiazuma
layout: post
guid: '{{ site.url }}/?p=5620'
permalink: /2021/03/16/menedzseljuk-a-sajat-gepunket/
newsphere-meta-content-alignment:
    - align-content-left
image: 'assets/uploads/2021/03/pexels-ramaz-bluashvili-6855582.jpg'
categories:
    - DevOps
    - 'Kocka élet'
    - Üzemeltetés
---

Amikor új gépet kapunk a munkahelyen, az mindig egy jó érzés. Mire szép lassan belakjuk és letöltünk rá mindent: böngészőt, IDE-t, egyéb csomagokat, beállítgatjuk a háttérképet, Steamet, Spotify-t és még sok mást. Ez az első pár alkalommal még egy kellemes élmény, mert az újdonság varázsa megszépíti az egészet, de amikor már az ötödik közel ugyanolyan laptopra kell mindezt megtenni, akkor már kevésbé élvezetes. Arról nem is beszélve, hogy a munkáltató minden percét megsiratja, ugyanis amíg telepítgetünk, addig bizony egy forintot se termelünk.

A szerverek konfiguráció menedzsmentjére és automatizálására már bevált módszerek vannak, de a saját asztali gépünkre vagy laptopunkra ezeket valamiért nem annyira használjuk. Holott, ha ügyesen csináljuk, akkor minden egyes ilyen újratelepítéssel értékes órákat spórolhatunk meg, nem beszélve arról az érzésről, amikor már azt hittük, hogy mindennel végeztünk, de a projekt első buildelésénél kiderül, hogy még valami hiányzik.

Az egyik ilyen eszköz az Ansible, amivel mi is fogunk foglalkozni a továbbiakban. Akad persze sok másik hasonló eszköz, de talán ez az egyik legkisebb erőforrás igényű - hiszen nem akarunk szervert üzemeltetni csak azért, hogy a saját gépünket menedzseljük -, és viszonylag könnyen érthető szintaxisa van.

A cikkben Linux rendszerekről lesz szó, de MacOS-en is használhatjuk, igaz némileg korlátozottan. Először azonban fontos megvizsgálni, hogy milyen gyakran is telepítünk újra gépet, hogy lássuk egyáltalán megéri-e? Ha tízévente egyszer, akkor bizonyára nem igazán éri mindez meg. Sajnos nem mindenki tud ennyire vigyázni a gépére, így akik szeretik felelősség nélkül széttúrni a rendszert, azoknak inkább szól ez a cikk. A másik csoport, akik - lévén rengeteg Linux disztribúció van a piacon - gyakran váltogatják a rendszerüket, próbálgatnak újakat. Ezt akár virtuális gépen, akár fizikain teszik, az automatizmus a segítségükre lehet.  
Szintén jól jöhet, ha van egy otthoni és egy munkahelyi gépünk, amiket közel azonos konfiguráción akarunk tartani.

Viszont sok a szöveg és kevés a kód, lássunk hozzá!

Szóval mi is ez az ansible? Az ansible egy python alapú eszköz, aminek a segítségével egy központi gépről tudunk más gépeket menedzselni. Ez úgynevezett agentless, azaz nem igényli azt, hogy az általa menedzselt gépen bármilyen speciális program fusson, így elég a központi gépre feltelepíteni, a többit SSH-n megoldja. A mi esetünkben a központi gép és a menedzselt gép is a localhost lesz, így ez nem is számít.

Először is telepítsük azt. A Linux/MacOS rendszereken a python megtalálható, így mi most annak a segítségével fogjuk telepíteni azt:

```
$ python -m pip install --user ansible
```

Ezzel már el is érhetővé válik az ansible parancs, amivel megállapíthatjuk, hogy minden klappol-e?

```
$ ansible --version
ansible 2.10.6
  config file = None
  configured module search path = [u'/home/tacsiazuma/.ansible/plugins/modules', u'/usr/share/ansible/plugins/modules']
  ansible python module location = /home/tacsiazuma/.local/lib/python2.7/site-packages/ansible
  executable location = /home/tacsiazuma/.local/bin/ansible
  python version = 2.7.18 (default, Mar  8 2021, 13:02:45) [GCC 9.3.0]
```

Mint mondtam, mi nem akarunk szervert igénybe venni ehhez, viszont nem ússzuk meg, hogy valahol tároljuk a konfigurációt. Erre egy github-os repository-t fogok használni, szóval hozzatok ti is létre egyet és utána klónozzátok azt le magatokhoz:

```
$ git clone https://github.com/letscodehu/localhost-ansible
```

Az ansible hoz magával egy speciális parancsot is, ami különösen jó lesz nekünk, ez pedig az ansible-pull. Ez lényegében annyit csinál, hogy egy távoli repositoryból letölti a konfigurációt és aztán nekiáll feldolgozni azt. Tehát pontosan jó lesz nekünk. Viszont ahhoz az kell, hogy ez a távoli repository tartalmazzon is valamit, így vigyük fel a konfigurációt!

Yaml fájlokat fogunk használni, amit sokan nem szeretnek, habár már kiirthatatlanul beleitta magát a devops világba. Legyen a fájl pl `local.yml`:

```
 - hosts: localhost
  become: true 
  tasks:
  - name: Install tmux
    apt: name=tmux
```

Elég egyszerű kis konfiguráció, nem? Annyit adunk meg neki, hogy a localhoszton dolgozzon, utána, mivel az apt parancshoz root user kell, ezért a `become: true`-val jelezzük, hogy szükség lesz egy privilégium eszkalációra a feladatok végrehajtására. Ha jelszó nélküli sudo van beállitva, akkor nincs más dolgunk, ha szükség van jelszóra, akkor pedig a paranccsorban hozzáfűzzük, hogy `--ask-become-pass` és rákérdez a jelszóra, amit használni fog. Ezután pedig felsoroljuk, hogy milyen feladatokat is kell végrehajtani a `tasks` alatt. Mindnek van neve, valamint egy hozzá tartozó modul, ami esetünkben az apt. Minden ilyen modulhoz elég jó dokumentáció van, példákkal, ennek például [itt](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html "itt"), de használhatjuk az ansible-doc parancsot is:

```
ansible-doc apt
```

Innen láthatjuk is, hogy lényegében az apt segítségével telepítjük vele a tmux csomagot. A taskok definíciója gyakorlatilag így néz ki:

```
 tasks:
 - name: feladat neve, mi adjuk meg
   modulneve: paraméter=érték
      paraméter: érték
      paraméter: érték
   általános_paraméterek: érték
```

Akkor most nézzük, hogy tudjuk ezt lefuttatni?

```
$ ansible-playbook local.yml
[WARNING]: No inventory was parsed, only implicit localhost is available
[WARNING]: provided hosts list is empty, only localhost is available. Note that the implicit localhost does not match 'all'

PLAY [localhost] ************************************************************************************************************************************************************

TASK [Gathering Facts] ******************************************************************************************************************************************************
ok: [localhost]

TASK [Install tmux] *********************************************************************************************************************************************************
ok: [localhost]

PLAY RECAP ******************************************************************************************************************************************************************
localhost                  : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

Na akkor mi is történt itt? A két warning azért van, mert nem egy localhosttal szoktak dolgozni, hanem több hosttal, azokat csoportokba szedve, stb. Ez az a bizonyos inventory, amit hiányol. Egy ilyen yaml fájl jelent egy play-t, a benne levő elemek pedig a taskok.  
Az `install tmux` még ismerős, de ez a `gathering facts` micsoda? Ez pontosan az, aminek tűnik, a célgépről összegyűjt információkat az ansible, környezeti változókat, stb. amik később hasznosak lehetnek. Na de ez még annyira nem volt hasznos, kicsit dobjuk fel, nem? Oké, hogy van tmux, de kell még pl neovim. Sőt, jó volna ha tmuxból is újat kapnánk, így legyen egy apt update előtte, nem?

A neovim telepítő linkje itt található:  
<https://github.com/neovim/neovim/wiki/Installing-Neovim#linux>

Ezt felhasználva:

```
- hosts: localhost
  become: true
  tasks:
  - name: update repositories
    apt: update_cache=yes
    changed_when: False
  - name: Install tmux
    apt: name=tmux
  - name: Install neovim
    get_url:
        url: https://github.com/neovim/neovim/releases/latest/download/nvim.appimage
        dest: /usr/local/bin/neovim
        mode: '0755'
```

Most felvettünk két új elemet. Az egyik, hogy az apt updatet lefuttatjuk, hogy biztosan a legfrissebb csomagokat húzzuk le, pl tmuxból. A neovimet másképp telepítjük majd, itt egy app imaget használunk. A `get_url` HTTP(S) forrásokból tud letölteni fájlokat, amiket amúgy lehet cURL-al oldanánk meg. Megadhatjuk, hogy honnan, hova töltsön le, valamint a célfájl jogosultságait is beállíthatjuk egy lépésben. Sokan egyébként arra esküsznek, hogy nekik nem kell semmit telepíteni szinte, hiszen mindent dockerben futtatnak. Na és a dockert hogy telepítik? Kézzel? Akkor automatizáljuk azt is! Azonban ezt nem egy fájlba fogjuk pakolni, hanem elkezdjük szeparálni a dolgokat.

```
$ mkdir tasks
$ vim tasks/terminal.yml
```

Ide kerülnek azok, amik pl a terminálhoz szükséges elemek:

```
  - name: update repositories
    apt: update_cache=yes
    changed_when: False
  - name: Install tmux
    apt: name=tmux
  - name: Install neovim
    get_url:
        url: https://github.com/neovim/neovim/releases/latest/download/nvim.appimage
        dest: /usr/local/bin/neovim
        mode: '0755'
```

Ami új lehet itt az a `changed_when: False`. Az ansible jelzi, ha valamelyik hoston változást okozott az egyik modul. Ezzel a kapcsolóval ezt ki tudjuk kapcsolni az adott taskra. Miért? Mert nem akarjuk, hogy mindig azt jelezze, hogy változott valami, holott csak újabb csomagok érhetőek el.  
Ezután pedig csinálunk egy playt a dockernek is:

```
$ vim tasks/docker.yml
```

Amibe az ahhoz szükséges elemek kerülnek:

```
- name: Install required system packages
  apt: name={{ item }} state=latest update_cache=yes
  loop: [ 'apt-transport-https', 'ca-certificates', 'curl', 'software-properties-common', 'python3-pip', 'virtualenv', 'python3-setuptools']

- name: Add Docker GPG apt Key
  apt_key:
    url: https://download.docker.com/linux/ubuntu/gpg
    state: present

- name: Add Docker Repository
  apt_repository:
    repo: deb https://download.docker.com/linux/ubuntu bionic stable
    state: present

- name: Update apt and install docker-ce
  apt: update_cache=yes name=docker-ce state=latest

- name: Install Docker Module for Python
  pip:
    name: docker
```

Cserébe a `local.yml` elkezd egyszerűsödni:

```
- hosts: localhost
  become: true
  tasks:
    - include: tasks/docker.yml
    - include: tasks/terminal.yml
```

Ilyenkor, ha `include`-ot használunk, akkor lényegében azokat a fájlokat egy az egyben beemeli oda, ezért nem kellett a fájlok elejére a `tasks:` sem.  
Ez mondjuk még nem minden, hiszen pl a neovimhez felrakhatjuk a csomagkezelőt, letölthetjük a `vimrc` fájlunkat githubról, telepíthetjük a plugineket a háttérben:

```
  - name: Install vundle
    git:
        repo: https://github.com/VundleVim/Vundle.vim.git
        dest: ~/.vim/bundle/Vundle.vim
    become_user: tacsiazuma
  - name: Setup vimrc
    get_url:
        url: https://raw.githubusercontent.com/Tacsiazuma/dotfiles/master/vimrc
        dest: /home/tacsiazuma/.vimrc
    become_user: tacsiazuma
  - name: Install neovim plugins
    command: nvim +PluginInstall +qall
    become_user: tacsiazuma
```

A vundlet `git clone` segítségével is felrakhatnánk, azonban az ansible modulok segítségével jobb mindez, ugyanis az úgynevezett idempotencia a cél a műveleteknél. Azaz ha többször lefuttatjuk ugyanazokat a taskokat egy gépen, akkor az állapot ugyanaz lesz. A modulok, ha látják, hogy már elértük a kívánt célt, akkor nem csinálnak semmit. Ellenben a `git clone` mindig lefut és másodjára már hibát jelezne, mert a mappa már létezik.

A `become_user` itt is fontos, ugyanis nem szeretnénk root felhasználóként létrehozni fájlokat, neovimet futtatni meg főleg, mert akkor másik vim configot használna.

Ez eddig viszont főleg azoknak jó, akik a terminálban élnek. Mi a helyzet a külsejével a rendszernek? Kedvenc téma, háttérkép? Ez is megoldható, amíg Linuxról van szó! Mivel most egy ubuntut akarunk testreszabni, ami Gnome asztali környezettel érkezik, ezért nevezzük a fájlt, amibe csoportosítjuk mindezt `gnome.yml`-nak. Ha pl KDE-vel akarjuk mindezt, akkor lehet `kde.yml` is a neve, hogy aztán ezeket a módosításokat tudjuk csoportosítgatni.  
Beállítjuk először a háttérképet, utána pedig témákat. Töltsünk le valami jó háttérképet és nevezzük el `wallpaper.jpg`-nek (vagy amilyen kiterjesztése van) és másoljuk a `files` mappába. Igaz nem jó dolog képeket és hasonló dolgokat verziókövetni, de remélhetőleg nem fogjuk folyton cserélgetni azt. Alternatív megoldásként használhatjuk a korábban látott `get_url` módszert is.

```
- name: Install python-psutil package
  apt: name=python3-psutil
- name: Copy wallpaper
  copy: src=files/wallpaper.jpg dest=/home/tacsiazuma/.wallpaper.jpg owner=tacsiazuma group=tacsiazuma mode=600
- name: Set GNOME Wallpaper
  become_user: tacsiazuma
  dconf: key="/org/gnome/desktop/background/picture-uri" value="'file:///home/tacsiazuma/.wallpaper.jpg'"
```

A `python3-psutil` csomagra azért van szükség, hogy az ansible dconf modul működjön. Ezután felmásoljuk a háttérképet a home mappánkba, `.wallpaper.jpg` néven, így rejtett fájl lesz, ezután pedig a dconf háttérképre vonatkozó kulcsának beállítjuk az elérési útját.  
Persze mehetünk tovább és átállíthatjuk a témát is:

```
- name: Install arc theme
  apt: name=arc-theme
- name: Set Arc theme
  become_user: tacsiazuma
  dconf: key="/org/gnome/desktop/interface/gtk-theme" value="'Arc'"
```

Természetesen ne felejtsük el ezeket a playeket is includeolni a `local.yml`-ben:

```
  tasks:
    - include: tasks/docker.yml
    - include: tasks/terminal.yml
    - include: tasks/gnome.yml
```

Ezután pedig nézzük, hogy is tudjuk ez tegy lépésben megtenni, hogy ne kelljen lehúzni a repot? Erre lesz jó a korábban említett `ansible-pull`! A változásokat commitoljuk, majd pusholjuk fel githubra. Ezután nincs más dolgunk, mint egy lépésben lehúzni azt és a benne levő playbookot lejátszani:

```
ansible-pull -U https://github.com/letscodehu/localhost-ansible
```

Ha új rendszert telepítünk, akkor ennyi dolgunk lesz összesen.  
Láthatjuk, hogy viszonylag könnyen tudjuk szépen egymás után fűzni a parancsokat, amikkel testreszabhatjuk a gépünket. Persze ez igényli azt is, hogy a konfigurációt naprakészen tartsuk. A `dconf` ebben segítségünkre lehet, hiszen a rendszeren végzett nem fájl vagy csomagszintű beállításokat végig tudjuk követni. Nincs más dolgunk, mint a friss telepítéskor kidumpolni, majd a módosítások után is és a két fájlt összevetni, hogy megtaláljuk a módosításokat:

```
dconf dump / > initial.txt
dconf dump / > changed.txt
diff initial.txt changed.txt
```

így már látjuk is, hogy miket módosítottunk, amiket a `dconf` kezel.

Ha pedig már a saját gépünket elkezdtük így menedzselni és nem állnak messze tőlünk a szerverek, akkor lehet érdemes azok menedzsmentjét is automatizálni, nemde?

Na de mi a helyzet a `.bashrc`-vel, `.tmux.conf`-al, `.Xmodmap`-el? Ezeket is pakoljuk be ide és másolgassuk őket? Szerencsénkre erre is lesz egy megoldás, a `dotfiles` nevű python csomag és egy másik github repo segítségével, amit a folytatásban fogunk kitárgyalni és integrálni az ansible playbookunkba.