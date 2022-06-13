pack build registry.gitlab.com/utkarshkanwat/cloud-server:latest  --buildpack gcr.io/paketo-buildpacks/nodejs \
  --builder paketobuildpacks/builder:base
docker push registry.gitlab.com/utkarshkanwat/cloud-server:latest
kubectl rollout restart deployment/node -n node