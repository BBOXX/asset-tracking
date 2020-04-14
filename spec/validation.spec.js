const validation = require('../server/validation.js');

describe("validate lat lng", function() {
    it("should validate right latitude and longitude", function() {
        // Act
        let latLngObj = { req:
                [ { lng: 34.59247666666667, lat: -0.7440616666666667 },
                    { lng: 34.67839166666667, lat: -0.35666499999999995 } ] };
        let result = validation.validateLatLng(latLngObj);

        // Assert
        expect(result['error']).toBeNull();
        expect(result).toEqual(jasmine.objectContaining({
            value: latLngObj
        }));
    });

    it("should validate wrong latitude and longitude", function() {
        // Act
        let latLngObj = { req:
                [ { lng: 670.59247666666667, lat: -0.7440616666666667 },
                    { lng: 34.67839166666667, lat: -0.35666499999999995 } ] };
        let result = validation.validateLatLng(latLngObj);

        // Assert
        expect(result['error']).not.toBeNull();
    });

    it("should validate wrong latitude and longitude", function() {
        // Act
        let latLngObj = { req:
                [ { lng: 34.59247666666667, lat: -0.7440616666666667 } ] };
        let result = validation.validateLatLng(latLngObj);

        // Assert
        expect(result['error']).not.toBeNull();
    });
});

describe("validate asset id", function() {
    it("should validate right asset id", function() {
        // Act
        let assetId = '114fe7e30b946fe1';
        let result = validation.validateAssetId(assetId);

        // Assert
        expect(result['error']).toBeNull();
        expect(result).toEqual(jasmine.objectContaining({
            value: assetId
        }));
    });

    it("should validate wrong asset id", function() {
        // Act
        let assetId = '114fe7e30b946fe';
        let result = validation.validateAssetId(assetId);

        // Assert
        expect(result['error']).not.toBeNull();
    });

    it("should validate wrong asset id", function() {
        // Act
        let assetId = '';
        let result = validation.validateAssetId(assetId);

        // Assert
        expect(result['error']).not.toBeNull();
    });
});

describe("validate date", function() {
    it("should validate right date", function() {
        // Act
        const start = '2018-01-01T00:00:00Z';
        const end = '2018-01-31T00:00:00Z';
        const date = {
            'start': new Date(start),
            'end': new Date(end)
        }
        let result = validation.validateDate(start, end);

        // Assert
        expect(result['error']).toBeNull();
        expect(result).toEqual(jasmine.objectContaining({
            value: date
        }));
    });

    it("should validate wrong date", function() {
        // Act
        const start = '2018-01-31T00:00:00Z';
        const end = '2018-01-01T00:00:00Z';
        let result = validation.validateDate(start, end);

        // Assert
        expect(result['error']).not.toBeNull();
    });
});

