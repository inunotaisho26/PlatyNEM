/****** Run this script once per database to create the global tables for sessions, and the global roles ******/
-- !!!IMPORTANT!!! Make sure you change "use" to the correct db.
USE [platynem-test-1]
GO
/****** Object:  DatabaseRole [db_execute]    Script Date: 7/28/2015 12:10:12 Will ******/
CREATE ROLE [db_execute]
GRANT EXECUTE TO [db_execute];
GO
/****** Object:  UserDefinedFunction [dbo].[UNIX_TIMESTAMP]    Script Date: 7/28/2015 12:10:12 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date, ,>
-- Description:	<Description, ,>
-- =============================================
CREATE FUNCTION [dbo].[UNIX_TIMESTAMP]
(
	-- Add the parameters for the function here
	@ctimestamp datetime
)
RETURNS integer
AS
BEGIN
	-- Declare the return variable here
	declare @return integer;

	SELECT @return = DATEDIFF(SECOND,{d '1970-01-01'}, @ctimestamp);

	return @return;
END

GO
/****** Object:  Table [dbo].[sessions]    Script Date: 7/28/2015 12:10:12 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sessions](
	[sid] [nvarchar](255) NOT NULL,
	[session] [nvarchar](max) NOT NULL,
	[expires] [int] NULL,
 CONSTRAINT [PK_sessions] PRIMARY KEY CLUSTERED
(
	[sid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO
/****** Object:  StoredProcedure [dbo].[CleanSessions]    Script Date: 7/28/2015 12:10:12 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[CleanSessions]
AS
BEGIN
      SET  NOCOUNT  ON

	  DELETE FROM dbo.sessions
		where
			sid != '' and
			expires > 0 and
			expires < dbo.UNIX_TIMESTAMP(getdate());
END


GO
/****** Object:  StoredProcedure [dbo].[ClearSessions]    Script Date: 7/28/2015 12:10:12 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[ClearSessions]
AS
BEGIN
      SET  NOCOUNT  ON

      WHILE @@TRANCOUNT > 0
         COMMIT

      TRUNCATE TABLE dbo.sessions
END



GO
/****** Object:  StoredProcedure [dbo].[DeleteSession]    Script Date: 7/28/2015 12:10:12 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[DeleteSession]
	-- Add the parameters for the stored procedure here
	@sid nvarchar(255)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	delete from dbo.sessions
	where
		sid = @sid;
END


GO
/****** Object:  StoredProcedure [dbo].[GetSession]    Script Date: 7/28/2015 12:10:12 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetSession]
	-- Add the parameters for the stored procedure here
	@sid nvarchar(255)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select top 1 * from dbo.sessions
	where
		sid = @sid;
END


GO
/****** Object:  StoredProcedure [dbo].[GetSessionsLength]    Script Date: 7/28/2015 12:10:12 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[GetSessionsLength]
	-- Add the parameters for the stored procedure here
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select count(*) as length from dbo.sessions
	where
		expires = 0 or
		expires > dbo.UNIX_TIMESTAMP(getdate());
END


GO
/****** Object:  StoredProcedure [dbo].[InsertSession]    Script Date: 7/28/2015 12:10:12 Will ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[InsertSession]
	-- Add the parameters for the stored procedure here
	@sid nvarchar(255),
	@session nvarchar(MAX),
	@expires int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF EXISTS (select top 1 sid from dbo.sessions where sid = @sid)
		BEGIN
			UPDATE dbo.sessions set
				session = @session,
				expires = @expires
				where sid = @sid;
		END
	ELSE
		BEGIN
			INSERT INTO dbo.sessions
				(sid, session, expires)
			VALUES
				(@sid, @session, @expires)
		END
END


GO
