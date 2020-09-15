# Yestermap

1. [Process data](process_data.ipynb)
2. [Load data](load_data.js)

## Deployment

Frontend:
```
yarn build && firebase deploy --only hosting
```

Backend:
```
gcloud builds submit --tag gcr.io/yestermap/yestermap
gcloud run deploy yestermap \
  --image gcr.io/yestermap/yestermap \
  --allow-unauthenticated \
  --set-env-vars TZ=Asia/Manila \
  --platform managed --region us-central1
```