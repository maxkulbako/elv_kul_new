const SessionNotesTab = () => {
  return (
    <div>
      {" "}
      Session Notes
      {/* <Card>
    <CardHeader>
      <CardTitle>Add Session Note</CardTitle>
      <CardDescription>
        Document your observations from the session
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <Textarea
        placeholder="Enter your session notes here..."
        className="min-h-[150px]"
      />
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <Input placeholder="Add tags separated by commas (e.g., anxiety, progress)" />
      </div>
    </CardContent>
    <CardFooter>
      <Button className="bg-olive-primary hover:bg-olive-primary/90">
        <Save className="h-4 w-4 mr-2" />
        Save Note
      </Button>
    </CardFooter>
  </Card>

  <div className="space-y-6">
    <h3 className="text-lg font-medium">Previous Notes</h3>
    {client.notes.map((note) => (
      <Card key={note.id}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {format(note.date, "MMM d, yyyy")}
            </CardTitle>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
          <div className="flex mt-4 flex-wrap gap-1">
            {note.tags.map((tag) => (
              <div
                key={tag}
                className="bg-olive-light text-olive-primary text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ))}
  </div> */}
    </div>
  );
};

export default SessionNotesTab;
