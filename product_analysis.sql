SELECT ProductID, ListPrice, Size FROM Production.Product
WHERE Color = 'black' 
AND (NAME LIKE 'ML%' 
OR NAME LIKE 'MO%') 
AND ProductID BETWEEN 1 AND 4000
AND color is not NULL
ORDER BY ProductID DESC;

SELECT
    p.ProductID,
    p.ListPrice,
    p.Size,
    st.Name AS SalesRegion
FROM Production.Product AS p
INNER JOIN Sales.SalesOrderDetail AS sod
    ON p.ProductID = sod.ProductID
INNER JOIN Sales.SalesOrderHeader AS soh
    ON sod.SalesOrderID = soh.SalesOrderID
INNER JOIN Sales.SalesTerritory AS st
    ON soh.TerritoryID = st.TerritoryID
WHERE p.Color = 'Black'
  AND (p.Name LIKE 'ML%' OR p.Name LIKE 'MO%')
  AND p.ProductID BETWEEN 1 AND 1000
ORDER BY p.ProductID ASC;



