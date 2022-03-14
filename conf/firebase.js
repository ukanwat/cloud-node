import admin from 'firebase-admin';
// import { v4 as uuidv4 } from 'uuid';
// const stripe = new stripeFactory('sk_test_51K9xV5SAnUBsbKeS716JirysfTM8OOyaI44Q7fIhjL1V3YkhKY4qAqNHsNAnJ8WzfEDB7jR2JhQLNi2cx5tXT3BW00bRb5J0ky', { apiVersion: '2020-08-27', });
admin.initializeApp({
    credential: admin.credential.cert({
        "projectId": "net-inc",
        "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTerWThWk5ti4q\njAQOobSmqFJ6Fzt2C1L5O/xrrXGgiWeZwunAt88AN5iswgFJXQYFRFW/hFpSflO7\nokFnOyyaov6xkjF4JpZA8BXkQgF4tKvY0U6lNiWeRE6DjUgMHwyjRRlvd+OVwfAJ\nTFMnPHgqFhhCR6ptT/x993b3TA8OrXhEQ/Tui65MjuKJf6pKCMqbfEDNquRqMGKd\nRKpbWs1rXCrOaEgaxrggFhCA7cosSvHplwGErrV6vyVNAFWA5mgFGSRpzn4SDVx5\ntvkQTcS4h+zA4djmcrqBLi+mfG36xRv78Y1ngkkKjMoKlS0M20ixDjvd7BBhunJg\nUw7gwW09AgMBAAECggEAEPImxaTtmyHFjkQ8+P0tMCORxFXDPoDGy9DqN6ikz8Pi\n6NfNClPQQwixc7pyBvJszpQ8uMV+xVh5FjJ4wjBkMRn5hbocu69/38E9R9agLo9v\nq8aN4kA2AHohvnneOZZtWVHqqVt2gaQSO3SBv0WhrWGq3PjIJ80+gsuHHWbbWAYa\nKbO3yry54jyscf87CfiMuDxouOpZAW1SulcqSTm9w59nmztzugTdShGmIwW/eM7j\n9aVQT+cepdmLdp2LUoulwvT9owI7rdD22ZlX/tpx6s2qOQ7hJ+a/wMaiXyq80r5D\nXnCGSJRsUNaGa/60zxeWTlFe+kWWTpoDw3Id3jQbswKBgQDxizK42llOwR0i4PNR\nq7XPaokvMc1MzWW2yAV2FJ0x+aL/5IPV8I22KKmFZWbWC1o3n8q6mTxt5kCr7388\nz+DJZkKbrQG5+hQY9jMrAlootwKFa+fiZeGIgcSOb4b+KeZ/7h9G8FcEFXiBjYJG\nnZnZ3Fmgg8jXE0FNKVfSdY5QQwKBgQDgIuFwBaUFxvA9o6P2epynjNVJKmz2wU/w\nzav6qVtCN7q3Zgz1ILZfWLQeqMew84ORYw96aVEnI8eB9iJCon8b5c2C3QdT2VmU\n5TiCUJ4LI6QEHnJiZGU90WAqWjj6QtaPik32XhP/TuF5oCRJ0TICWM3LjpAZPtuy\nK+WmVR40fwKBgQDBoX361AdN699oi35jFUy9RsFMlRboH6wPV8+Q9juByYZSrqTF\nB38C7RvgdQZ4Rkd/WdiRt6/Kxg9IBckxPdAMg66Xz5wXs5MS46LnMo6GHxelT3hn\ndJbU8HpaWKuV6o7+NSzbmGWZP4EIEiHCbCrejBdJZvvE9omdyqu9akG4swKBgQCk\nfdTXIr1ehQbRJeRyQr/vUzNAtAst+OdTQY4isuHPshis+g8uYyiUxwPBsHqFSeHX\n9ExquRoe0Gpd3aZ9IsaIUdnGXbI//jZ5SNR1BvdGE40OnM2zmhyXBq89xeMk/6J5\ny7W1xouEhn6BhV68cfPytvuplWH5tSEFHKQ4syUsvwKBgGz1LMx5lbZXC4kUlk/L\njFy8tjz7RJSQfHGZ5X3bAAC2TwqIbOFM8Dww19YHqMDrcJr1gdo1WTM+svAGjhth\n9zYaExILrFl/L1j1dOJgehYqcGUg3kV2yVfo5TAIyPykW7zYhKFR24Tt9nG52+BY\nbRtR7pxfrObmfzvQwjlD+ok7\n-----END PRIVATE KEY-----\n",
        "clientEmail": "firebase-adminsdk-ftt75@net-inc.iam.gserviceaccount.com",
    }),
    databaseURL: "https://net-inc.firebaseio.com"
});


export { admin }
