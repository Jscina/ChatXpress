UPDATE assistants
SET
    assistant_name = ?,
    description = ?,
    model = ?,
    instructions = ?,
WHERE
    id = ?
    AND assistant_id = ?