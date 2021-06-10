docker stop classcipe_local
docker rm classcipe_local
docker rmi classcipe:local
docker build . -t classcipe:local
docker run -itd -p 80:80 --name classcipe_local classcipe:local
docker ps -a