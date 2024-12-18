Docker kurulu olmalı. Bütün kurulum downloadlarlarla birlikte yaklaşık 20 dakika sürebilir. Sıralamayı sakın bozma.
Sadece chrome tabanlı bir browser kullanılmalı. Firefox kullanılırsa çalışmaz.
> docker pull osrm/osrm-backend

boş bir klasör oluştur.
bu klasörde conf diye bir klasör oluştur.
config.yml dosyasını conf klasörüne at.
ana klasöre dön!!

> https://download.geofabrik.de/europe/turkey-latest.osm.pbf bu linkten dosyayı indir.
az önce oluşturduğun klasörde dosyayı klasör içine at. klasörün içine gidip aşağıdaki komutları sırasıyla çalıştır.
Aşağıdaki komutları Powershellde çalıştırıyorsan $(pwd) yerine ${pwd} yaz.

> docker run -t -v $(pwd):/data osrm/osrm-backend osrm-extract -p /opt/car.lua /data/turkey-latest.osm.pbf
> docker run -t -v $(pwd):/data osrm/osrm-backend osrm-partition /data/turkey-latest.osm.pbf
> docker run -t -v $(pwd):/data osrm/osrm-backend osrm-customize /data/turkey-latest.osm.pbf

> docker create network furkan-bridge

OSRM API çalıştırmak için;
> docker run -d --name osrm --network furkan-bridge -p 5000:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/turkey-latest.osrm

VROOM API çalıştırmak için;
> docker run -dt --rm --name vroom --network furkan-bridge -p 3000:3000 -v $PWD/conf:/conf -e VROOM_ROUTER=osrm ghcr.io/vroom-project/vroom-docker:v1.14.0


## FE
Kodun bulunduğu dizine gel.     
>npm install
>npm run dev

## BE
Kodun bulunduğu dizine gel. 
>pip install flask flask-cors flask-sqlalchemy
>python app.py


docker run -t -v ${pwd}:/data osrm/osrm-backend osrm-customize /data/turkey-latest.osm.pbf